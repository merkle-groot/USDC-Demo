import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useContractFunction, useEthers } from '@usedapp/core'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { USDC, Staker } from '../components/contracts';
import { BigNumber, utils, providers, Contract } from "ethers";
import "../pagesStyling/USDC.css";


const chainReadProvider = new providers.StaticJsonRpcProvider('http://localhost:8545');

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


const useTokenInfo = (spenderAddress) => {
    const [balance, setBalance] = useState(BigNumber.from(0));
    const [allowance, setAllowance] = useState({
        loading: false,
        value: BigNumber.from(0),
    });
    const tokenContract = useTokenContract();
    const { account } = useEthers();

    const { state: mintState, send: sendMint } = useContractFunction(
        tokenContract,
        "freeMint"
    );
    const { state: increaseAllowanceState, send: increaseAllowance } =
        useContractFunction(tokenContract, "increaseAllowance");

    const fetchBalance = useCallback(async () => {
        if (!account) return;
        const userBalance = await tokenContract.balanceOf(account);
        setBalance(userBalance);
    }, [account, tokenContract]);

    // const fetchAllowance = useCallback(async () => {
    //     if (!account || !spenderAddress) return;

    //     setAllowance((allowance) => ({
    //         ...allowance,
    //         loading: true,
    //     }));
    //     const userAllowance = await tokenContract.allowance(
    //         account,
    //         spenderAddress
    //     );
    //     setAllowance({
    //         value: userAllowance,
    //         loading: false,
    //     });
    // }, [account, spenderAddress, tokenContract]);

    // const freeMint = useCallback(async () => {
    //     sendMint(utils.parseEther("1337"));
    // }, [sendMint]);

    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);

    // useEffect(() => {
    //     if (mintState.status === "Success") {
    //         fetchBalance();
    //     }
    // }, [mintState, fetchBalance]);

    // useEffect(() => {
    //     fetchAllowance();
    // }, [fetchAllowance]);

    // useEffect(() => {
    //     if (increaseAllowanceState.status === "Success") {
    //         fetchAllowance();
    //     }
    // }, [fetchAllowance, increaseAllowanceState]);

    return {
        balance,
        // allowance,
        // freeMint,
        // increaseAllowance,
        // fetchBalance,
        // fetchAllowance,
    };
};

// const useStakerInfo =(
//     fetchBalance,
//     fetchAllowance
// ) => {
//     const { account } = useEthers();
//     const stakerContract = useStakerContract();
//     const [depositedAmount, setDepositedAmount] = useState({
//         deposit: BigNumber.from(0),
//         treasury: BigNumber.from(0),
//     });
//     const { state: depositState, send: sendDeposit } = useContractFunction(
//         stakerContract,
//         "depositTokens"
//     );
//     const { state: withdrawState, send: sendWithdraw } = useContractFunction(
//         stakerContract,
//         "withdrawTokens"
//     );

//     const fetchDeposit = useCallback(async () => {
//         if (!account) return;
//         const userDeposited = await stakerContract.depositedAmount(account);
//         const treasuryAmount = await stakerContract.treasuryAmount();
//         setDepositedAmount({ deposit: userDeposited, treasury: treasuryAmount });
//     }, [account, stakerContract]);

//     const withdrawDeposit = useCallback(async () => {
//         sendWithdraw(depositedAmount.deposit);
//     }, [sendWithdraw, depositedAmount]);

//     useEffect(() => {
//         fetchDeposit();
//     }, [fetchDeposit]);

//     useEffect(() => {
//         if (depositState.status === "Success") {
//             fetchDeposit();
//             fetchBalance();
//             fetchAllowance();
//         }
//     }, [depositState, fetchDeposit, fetchAllowance, fetchBalance]);

//     useEffect(() => {
//         if (withdrawState.status === "Success") {
//             fetchDeposit();
//             fetchBalance();
//         }
//     }, [withdrawState, fetchBalance, fetchDeposit]);

//     return {
//         depositedAmount,
//         sendDeposit,
//         withdrawDeposit,
//     };
// };



const USDCApp = () => {
    const { activateBrowserWallet, active, account,  deactivate,} = useEthers();
    const {
        balance
    } = useTokenInfo(Staker.address);
    // const { depositedAmount, sendDeposit, withdrawDeposit } = useStakerInfo(
    //     fetchBalance,
    //     fetchAllowance
    // );


    const connectDisconnet = async () => {
        if (!active)
            activateBrowserWallet();
        else
            deactivate();
    }

    useEffect(() => {
        console.log(chainReadProvider);
    });

    return (
        <div className="USDCApp">
            <Container className="ContainerUSDC" fluid="md">
                <Row className="RowUSDC">
                    <Col className="ColUSDC">
                        <h1 style={{ whiteSpace: 'pre-line' }}>{'USDC\nFunctions'}</h1>
                    </Col>
                    <Col className="ColUSDC">

                        <div>
                            {
                                <ListGroup >
                                    <ListGroup.Item>Address: {account ? account : 'Not Connected'}</ListGroup.Item>
                                    <ListGroup.Item>Ether Balance: {balance?utils.formatEther(balance):'Not Connected'}</ListGroup.Item>
                                </ListGroup>
                            }
                            <div>
                                <Button onClick={() => connectDisconnet()}>{active ? 'Disconnect Wallet' : 'Connect Wallet'}</Button>
                            </div>
                            {/* <Button onClick={()=>getBlockNo()}>Block</Button> */}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default USDCApp;