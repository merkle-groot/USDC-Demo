import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BigNumber, utils, providers, Contract } from "ethers";
import { USDC, Staker } from '../components/contracts';
import { useContractFunction, useEthers } from '@usedapp/core'
import "../pagesStyling/USDC.css";
import { formatUnits } from '@ethersproject/units';

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
        "mintCoins"
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
        sendMint(account, utils.parseUnits("1000"));
    }, [sendMint, account]);

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


const useStakerContract = () => {
    const { library } = useEthers();

    return useMemo(() => {
        return new Contract(
            Staker.address,
            Staker.abi,
            library ? library.getSigner() : chainReadProvider
        );
    }, [library]);
};

const useStakerInfo = (
    fetchBalance,
    fetchAllowance
) => {
    const { account } = useEthers();
    const stakerContract = useStakerContract();
    const [depositedAmount, setDepositedAmount] = useState({
        deposit: BigNumber.from(0),
        timestamp: 0
    });

    const [treasuryFees, setTreasuryFees] = useState(0);

    const { state: depositState, send: sendDeposit } = useContractFunction(
        stakerContract,
        "stake"
    );
    const { state: withdrawState, send: sendWithdraw } = useContractFunction(
        stakerContract,
        "unStake"
    );
    const getTime = (unformattedTime) => {
        const unixTimeStamp = parseInt(formatUnits(unformattedTime, 0));
        if(unixTimeStamp === 0)
            return 0;
        console.log(unixTimeStamp);
        var time = new Date(unixTimeStamp).toLocaleTimeString();
        return time;
    }

    const fetchDeposit = useCallback(async () => {
        if (!account) return;
        const userDeposited = await stakerContract.staked(account);
        const treasuryAmount = await stakerContract.feesCollected();
        setTreasuryFees(utils.formatUnits(treasuryAmount,6));
        setDepositedAmount({ deposit: userDeposited.stakedAmount, treasury: getTime(userDeposited.stakedTimestamp)});
    }, [account, stakerContract]);

    const withdrawDeposit = useCallback(async () => {
        sendWithdraw(depositedAmount.deposit);
    }, [sendWithdraw, depositedAmount]);

    useEffect(() => {
        fetchDeposit();
    }, [fetchDeposit]);

    useEffect(() => {
        if(depositState)
            if (depositState.status === "Success") {
                fetchDeposit();
                fetchBalance();
                fetchAllowance();
            }
    }, [depositState, fetchDeposit, fetchAllowance, fetchBalance]);

    useEffect(() => {
        if(withdrawState)
            if (withdrawState.status === "Success") {
                fetchDeposit();
                fetchBalance();
            }
    }, [withdrawState, fetchBalance, fetchDeposit]);

    return {
        depositedAmount,
        sendDeposit,
        withdrawDeposit,
        treasuryFees
    };
};

const Staking = () => {
    const { activateBrowserWallet,active, deactivate, account, chainId} = useEthers();
    const [stakedInput, setStakedInput] = useState(0);
    const {
        balance,
        freeMint,
        allowance,
        increaseAllowance,
        fetchBalance,
        fetchAllowance,
    } = useTokenInfo(Staker.address);

    const { depositedAmount, sendDeposit, withdrawDeposit, treasuryFees, } = useStakerInfo(
        fetchBalance,
        fetchAllowance
    );

    const connectDisconnet = () => {
        if (!active)
            activateBrowserWallet();
        else
            deactivate();
    }

    const stake = () => {
        let allowanceFormatted = utils.formatUnits(allowance.value,6);
        if(allowanceFormatted < stakedInput){
            alert("Insufficient Approved USDC. Please increase the allowance.");
            return;
        }
        sendDeposit(stakedInput*10**6);
    }

    const unstake = () => {
        // TODO: Handle Errors
        withdrawDeposit();
    }

    const requestNetworkChange = async() => {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x5' }], 
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
                        <h1 style={{ whiteSpace: 'pre-line' }}>{'Staking\nFunctions'}</h1>
                    </Col>
                    <Col className="ColUSDC">
                        { active &&
                            <div>
                                <ListGroup >
                                    <ListGroup.Item>Address: <span className="value address"> {account?account:'Not Connected'} </span> </ListGroup.Item>
                                    <ListGroup.Item>Staked Amount: <span className="value"> {depositedAmount?formatUnits(depositedAmount.deposit, 6):'Not Connected'} USDC</span></ListGroup.Item>
                                    <ListGroup.Item>Allowance for Staking Contract: <span className="value"> {allowance ? utils.formatUnits(allowance.value, 6) : 'Not Connected'} USDC</span> </ListGroup.Item>
                                    <ListGroup.Item>Time staked at: <span className="value"> {depositedAmount?depositedAmount.treasury:'Not Connect'} UTC </span> </ListGroup.Item>
                                    <ListGroup.Item>Total Fees Collected: <span className="value"> {treasuryFees?treasuryFees:'Not Connect'} USDC</span> </ListGroup.Item>
                                    <InputGroup className="mb-3">
                                            <FormControl
                                                placeholder="Enter the amount of USDC to be staked"
                                                aria-label="StakeInput"
                                                aria-describedby="stake"
                                                value={stakedInput}
                                                onChange={(e)=> setStakedInput(e.target.value)}
                                                type="number"
                                                min="0.000001"
                                            />
                                            <Button variant="success" id="StakeInputButton" onClick={()=> stake()}>
                                                Stake!
                                            </Button>
        
                                    </InputGroup>
                                    <Button variant="warning" id="unstakeInputButton" onClick={()=> unstake()}>
                                        Unstake!
                                    </Button>
                                </ListGroup>
                            </div>
                        }
                        {!active &&
                            <div className="disconnetButton">
                                <Button onClick={() => connectDisconnet()}>{active?'Disconnect Wallet':'Connect Wallet'}</Button>
                            </div>
                        }
                        
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Staking;