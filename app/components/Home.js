import React, { Component } from 'react';
import ModalAddUser from './ModalAddUser';
import UserItem from './UserItem';
import Loading from './Loading';

class Home extends Component {
  constructor(props) {
    super(props);
    console.log(props);

    this.state = {
        showAddForm: 0,
        selectedUser: null,
        loaded: true,
        users: []
    };

  }


    componentDidMount() {
      this.props.db.find({ status: 1 }).sort({ starttime: 1 }).exec((err, docs) => {
          this.setState({
              loaded: false,
              users: docs
          });
      });
    }

  showAddForm() {

    this.setState({
        showAddForm: 1,
        selectedUser: null
    });
  }

  showAddForm2(user) {
      this.setState({
        showAddForm: 1,
        selectedUser: user
      });
  }

  handleAddUser(user) {
    console.log('add user', user);

    var nextUsers;

    if( typeof user._id === 'undefined' ){
        this.props.db.insert(user, (err, newUser) => {

            nextUsers = this.state.users;
            nextUsers.push(newUser);

            this.setState({
                showAddForm: 0,
                users: nextUsers,
                selectedUser: null
            });
        });
    } else {
        this.props.db.update({ _id: user._id }, user, {}, (err, numAffected) => {

            nextUsers = this.state.users.map((usr) => {
                if( usr._id === user._id ){
                    return user;
                }
                return usr;
            });

            this.setState({
                showAddForm: 0,
                users: nextUsers,
                selectedUser: null
            });
        });
    }

  }

  handleDeleteUser(user) {

        this.props.db.update({ _id: user._id }, user, {}, (err, numAffected) => {
            var nextUsers = [];
            this.state.users.forEach((usr) => {
                if( usr._id !== user._id ){
                    nextUsers.push(usr);
                }
            });

            this.setState({
                showAddForm: 0,
                users: nextUsers,
                selectedUser: null
            });
        });
  }

  handlePay(user) {

    this.props.db.update({ _id: user._id }, { $set: user }, {}, (err, numAffected) => {
            var nextUsers = [];
            this.state.users.forEach((usr) => {
                if( usr._id !== user._id ){
                    nextUsers.push(usr);
                }
            });

            this.setState({
                showAddForm: 0,
                users: nextUsers,
                selectedUser: null
            });
        });
  }

  toggleModal() {
    this.setState({
        showAddForm: !this.state.showAddForm
    });
  }

  render() {
    const { users } = this.state;

    const userItems = users.map((user, index) =>
            <div key={'user_'+user._id} className="d-inline-block align-top mx-1 mb-1">
                <UserItem user={user} onShowForm={(user) => this.showAddForm2(user)} />
            </div>
    );

    if( this.state.loaded ){
        return <Loading show={this.state.loaded} />
    }


    console.log('render home');

    return (

        <div className="user-list p-3">
            {userItems}
            <div className="box-user-add d-inline-block align-top mx-1 mb-1">
                <div className="card text-center" style={{width: '12rem'}} onClick={() => this.showAddForm()}>
                    <div className="card-body">
                        <p className="card-title">
                            <i className="fa fa-plus fa-lg"></i>
                        </p>
                        <p className="card-title">고객추가</p>
                    </div>
                </div>
            </div>

            <ModalAddUser
                isOpen={this.state.showAddForm}
                user={this.state.selectedUser}
                onSave={this.handleAddUser.bind(this)}
                onDelete={this.handleDeleteUser.bind(this)}
                onPay={this.handlePay.bind(this)}
                toggle={this.toggleModal.bind(this)} />
        </div>
    );
  }
}


export default Home;