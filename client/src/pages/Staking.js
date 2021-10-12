import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "../pagesStyling/USDC.css";

const Staking = () => {
    return(
        <div className="USDCApp">
            <Container className="ContainerUSDC" fluid="md">
                <Row className="RowUSDC"> 
                    <Col className="ColUSDC">
                        <h1 style={{whiteSpace: 'pre-line'}}>{'Staking\nFunctions'}</h1>
                    </Col>
                    <Col className="ColUSDC">
    
                        <div>
                            {
                                <ListGroup >
                                    {/* <ListGroup.Item>Address: {account?account:'Not Connected'}</ListGroup.Item> */}
                                    {/* <ListGroup.Item>Ether Balance: {etherBalance?formatEther(etherBalance):'Not Connected'}</ListGroup.Item> */}
                                </ListGroup>
                            }
                            <div>
                                {/* <Button onClick={() => connectDisconnet()}>{isConnected?'Disconnect Wallet':'Connect Wallet'}</Button> */}
                            </div>
                            {/* <Button onClick={()=>getBlockNo()}>Block</Button> */}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Staking;