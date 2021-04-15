import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { numberFormat, calculateFee } from './helper';
import Timer from './Timer';
import ModalPay from './ModalPay';

const messages = {
  placeholders: {
    username: "이름을 입력하세요."
  }
};

function defaultUser() {
    return {
        name: '',
        student: 0,
        adult: 0,
        accompanied: 0,
        drink: 0,
        shoes: 0,
        starttime: 0,
        endtime: 0,
        usagetime: '0:00',
        amount: 0,
        status: 0
    }
}


class ModalAddUser extends Component {
    constructor(props) {
      super(props);

      this.state = {
          user: defaultUser(),
          price: 0,
          modelPayOpen: 0
      }

      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleTimeChange = this.handleTimeChange.bind(this);
      this.handleSave = this.handleSave.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
      this.handlePay = this.handlePay.bind(this);
      this.toggleModalPay = this.toggleModalPay.bind(this);

      this.timer = React.createRef();
    }

     componentDidUpdate(prevProps, prevState, snapshot) {
        this.nameInput && !this.nameInput.value && this.nameInput.focus();
     }

    static getDerivedStateFromProps(nextProps, prevState) {

        if( nextProps.user !== null ){
            return {
                user: nextProps.user,
                price: calculateFee(nextProps.user),
                modelPayOpen: 0
            }
        } else {
            return {
                user: defaultUser(),
                price: 0,
                modelPayOpen: 0
            };
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        var nextUser = this.state.user;
        nextUser[name] = value;

        var newPrice = this.state.price;
        if( name !== 'name' ){
            newPrice = calculateFee(nextUser);
        }

        this.setState({
            user: nextUser,
            price: newPrice
        });
    }

    handleTimeChange() {
        this.setState({
            price: calculateFee(this.state.user)
        });
    }

    handleSave(event) {

        event.preventDefault();

        var user = this.state.user;
        if( !user._id ){
            user.starttime = (new Date()).getTime();
            user.status = 1;
        }

        this.props.onSave(user);

        return false;
    }

    handlePay(price) {
        var user = this.state.user;
        user.status = 2;
        user.amount = parseInt(price);
        user.endtime = (new Date()).getTime();
        user.usagetime = this.timer.current.outputTime;

        this.props.onPay(user);
    }

    handleDelete() {
        var user = this.state.user;

        if( confirm(user.name+"님의 이용카드를 삭제하시겠습니까?") ){
            user.status = 0;

            this.props.onDelete(user);
        }
    }

    toggleModalPay() {
        this.setState({
            modelPayOpen: !this.state.modelPayOpen
        });
    }

    render() {

        var placeholders = messages.placeholders;
        //console.log('render add user', this.state.user);

        const { user } = this.state;

        var start = 0;
        if( this.props.user !== null ){
            start = this.props.user.starttime;
        }

        var price = this.state.price || 0;

        return (
            <Modal className="modal-add-user" isOpen={this.props.isOpen} centered={this.props.centered} toggle={this.props.toggle}>
                <ModalBody>
                    <Form onSubmit={this.handleSave}>
                        <FormGroup row>
                            <Col sm={8}>
                                <Input type="text" innerRef={el => this.nameInput = el} name="name" placeholder={placeholders.username} value={user.name} onChange={this.handleInputChange} />
                            </Col>
                            <Col sm={4} className="text-right">
                                <Timer ref={this.timer} start={start} onChangeHour={this.handleTimeChange} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="studentCount" sm={2}>학생</Label>
                            <Col sm={4}>
                                <Input type="number" min={0} name="student" id="studentCount" value={user.student} onChange={this.handleInputChange} />
                            </Col>

                            <Label for="shoesCount" sm={2}>신발대여</Label>
                            <Col sm={4}>
                                <Input type="number" min={0} name="shoes" id="shoesCount" value={user.shoes} onChange={this.handleInputChange} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="adultCount" sm={2}>성인</Label>
                            <Col sm={4}>
                                <Input type="number" min={0} name="adult" id="adultCount" value={user.adult} onChange={this.handleInputChange} />
                            </Col>

                            <Label for="drinkCount" sm={2}>음료</Label>
                            <Col sm={4}>
                                <Input type="number" min={0} name="drink" id="drinkCount" value={user.drink} onChange={this.handleInputChange} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="guardianCount" sm={2}>동행</Label>
                            <Col sm={4}>
                                <Input type="number" min={0} name="accompanied" id="guardianCount" value={user.accompanied} onChange={this.handleInputChange} />
                            </Col>
                            <Label sm={2}>이용금액</Label>
                            <Col sm={4} className="pt-2">
                                <strong className="text-price text-danger">{numberFormat(price)}원</strong>
                            </Col>
                        </FormGroup>
                      </Form>

                      <ModalPay isOpen={this.state.modelPayOpen} toggle={this.toggleModalPay} centered={this.props.centered} onConfirm={this.handlePay} price={price} />
                </ModalBody>
                {typeof user._id === 'undefined' ? (
                <ModalFooter>
                    <Button type="button" color="primary" className="px-4" onClick={this.handleSave}>저장</Button>
                    <Button type="button" color="secondary" className="px-4" onClick={this.props.toggle}>취소</Button>
                </ModalFooter>
                ) : (
                <ModalFooter>
                    <Button type="button" color="secondary" className="px-4 mr-auto" onClick={this.handleDelete}>삭제</Button>
                    <Button type="button" color="primary" className="px-4" onClick={this.handleSave}>저장</Button>
                    <Button type="button" color="danger" className="px-4" onClick={this.toggleModalPay}>결제</Button>
                </ModalFooter>
                )}
            </Modal>
        );
    }
};

ModalAddUser.defaultProps = {
    user: {
      name: '',
      starttime: 0
    },
    isOpen: false,
    centered: true
}

export default ModalAddUser;