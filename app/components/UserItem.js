import React, { Component } from 'react';
import { numberFormat, calculateFee } from './helper';
import Timer from './Timer'

class UserItem extends Component {
    constructor(props) {
      super(props);

        this.state = {
            price: 0
        };

        this.handleTimeChange = this.handleTimeChange.bind(this)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            price: calculateFee(nextProps.user)
        }
    }

    handleClick() {
        const user = this.props.user;

        this.props.onShowForm(user);
    }

    handleTimeChange() {
        this.setState({
            price: calculateFee(this.props.user)
        });
    }

    render() {
        const { user } = this.props;

        return (
            <div className="card" style={{width: '12rem'}} onClick={() => this.handleClick()}>
                <div className="card-header position-relative">
                    {user.name}
                    <span className="float-right">
                        <Timer start={user.starttime} onChangeHour={this.handleTimeChange} />
                    </span>
                </div>
                <div className="card-body">
                    <p className="card-text text-right">
                        {numberFormat(this.state.price)}원
                    </p>
                </div>
            </div>
        );
    }
}

export default UserItem;