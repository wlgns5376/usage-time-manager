import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Row, Col, InputGroup, InputGroupAddon } from 'reactstrap';
import NumberFormat from 'react-number-format';

class ModalPay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            price: 0
        };

        this.handleChange = this.handleChange.bind(this);
        this.handlePay = this.handlePay.bind(this);
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            price: nextProps.price
        }
    }

    handleChange(values) {
        this.setState({
            price: values.value
        });
    }

    handlePay() {
        this.props.onConfirm(this.state.price);
    }

    render() {
        const price = this.state.price;

        return (
            <Modal className="modal-payment" isOpen={this.props.isOpen} centered={this.props.centered} toggle={this.props.toggle}>
                <ModalBody>
                    <p className="mb-4"><strong>아래의 금액으로 결제 처리하시겠습니까?</strong></p>
                    <form className="form-inline justify-content-center">
                        <div className="form-group">
                            <label className="mr-3">이용금액</label>
                            <div className="input-group">
                                <NumberFormat className="form-control text-danger font-weight-bold" thousandSeparator={true} value={price} onValueChange={this.handleChange} />
                                <div class="input-group-append">
                                    <span class="input-group-text text-danger font-weight-bold">원</span>
                                </div>
                            </div>
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="primary" className="px-4" onClick={this.handlePay}>확인</Button>
                    <Button type="button" color="secondary" className="px-4" onClick={this.props.toggle}>취소</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default ModalPay;