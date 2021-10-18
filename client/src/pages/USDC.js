import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useContractFunction, useEthers } from '@usedapp/core'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { USDC, Staker } from '../components/contracts';
import { BigNumber, utils, providers, Contract } from "ethers";
import "../pagesStyling/USDC.css";



const chainReadProvider = new providers.StaticJsonRpcProvider(process.env.REACT_APP_BASE_GOERLIURL);

const useTokenContract = () => {
    const { library } = useEthers();

    return useMemo(() => {
        return new Contract(
            USDC.address,
            USDC.abi,
            library ? library.getSigner() : chainReadProvider
        );
    }, [library]);
};


const useTokenInfo = (spenderAddress) => {
    const [balance, setBalance] = useState(BigNumber.from(0));
    const [allowance, setAllowance] = useState({
        loading: false,
        value: BigNumber.from(0),
    });

    const tokenContract = useTokenContract();
    const { account } = useEthers();

    const fetchBalance = useCallback(async () => {
        if (!account) return;
        const userBalance = await tokenContract.balanceOf(account);
        setBalance(userBalance);
    }, [account, tokenContract]);

    const { state: mintState, send: sendMint } = useContractFunction(
        tokenContract,
        "testMint"
    );

    const { state: increaseAllowanceState, send: increaseAllowance } =
        useContractFunction(tokenContract, "approve");

    const fetchAllowance = useCallback(async () => {
        if (!account || !spenderAddress) return;

        setAllowance((allowance) => ({
            ...allowance,
            loading: true,
        }));
        const userAllowance = await tokenContract.allowance(
            account,
            spenderAddress
        );
        setAllowance({
            value: userAllowance,
            loading: false,
        });
    }, [account, spenderAddress, tokenContract]);


    const freeMint = useCallback(async () => {
        sendMint(account);
    }, [account, sendMint]);

    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);

    useEffect(() => {
        if (mintState)
            if (mintState.status === "Success") {
                fetchBalance();
            }
    }, [mintState, fetchBalance]);

    useEffect(() => {
        fetchAllowance();
    }, [fetchAllowance]);

    useEffect(() => {
        if (increaseAllowanceState)
            if (increaseAllowanceState.status === "Success") {
                fetchAllowance();
            }
    }, [fetchAllowance, increaseAllowanceState]);

    return {
        balance,
        allowance,
        freeMint,
        increaseAllowance,
        fetchBalance,
        fetchAllowance
    };
};



const USDCApp = () => {
    const { activateBrowserWallet, active, account, deactivate, chainId} = useEthers();

    const [allowanceInput, setAllowanceInput] = useState(50);

    const {
        balance,
        allowance,
        freeMint,
        increaseAllowance,
    } = useTokenInfo(Staker.address);

    const connectDisconnet = () => {
        if (!active)
            activateBrowserWallet();
        else
            deactivate();
        console.log(chainId);
    }

    const mintCoins = (toAccount) => {
       freeMint();
       console.log(chainId);
    }

    const changeAllowance = () => {
        increaseAllowance(Staker.address, allowanceInput*10**6);
    }

    const requestNetworkChange = async() => {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x4' }], 
        });
    }

    useEffect(()=>{
        if(chainId!==5)
         requestNetworkChange();
    },[chainId])

 
    
    return (
        <div className="USDCApp">
            <Container className="ContainerUSDC" fluid="md">
                <Row className="RowUSDC">
                    <Col className="ColUSDC">
                        <h1 style={{ whiteSpace: 'pre-line' }}>{'USDC\nFunctions'}</h1>
                    </Col>
                    <Col className="ColUSDC">
                        {active &&
                            <div>
                                <ListGroup >
                                    <ListGroup.Item>Address:  <span className="value address"> {account ? account : 'Not Connected'} </span> </ListGroup.Item>
                                    <ListGroup.Item>USDC Balance: <span className="value"> {balance ? utils.formatUnits(balance, 6) : 'Not Connected'} USDC</span> </ListGroup.Item>
                                    <ListGroup.Item>Allowance for Staking Contract: <span className="value"> {allowance ? utils.formatUnits(allowance.value, 6) : 'Not Connected'} USDC</span> </ListGroup.Item>
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            placeholder="Approve funds to be spent by Staking Contract"
                                            aria-label="Allowance"
                                            aria-describedby="approve"
                                            value={allowanceInput}
                                            onChange={(e)=> setAllowanceInput(parseInt(e.target.value))}
                                            type="number"
                                            min="0.000001"
                                        />
                                        <Button variant="warning" id="Increase Allowance" onClick={()=> changeAllowance()}>
                                            Approve!
                                        </Button>
                                    </InputGroup>
                                    <Button variant="success" id="Mint" onClick={()=> mintCoins(account)}>Mint 1000 USDC tokens</Button>
                                </ListGroup>
                                    
                            </div>
                            
                        }
                        {!active &&
                            <div className="disconnectButton">
                                <Button onClick={() => connectDisconnet()}>{active ? 'Disconnect Wallet' : 'Connect Wallet'}</Button>
                            </div>
                        }                       
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
export default USDCApp;