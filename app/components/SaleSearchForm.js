import React, { Component } from 'react';
import { getTextByDate } from './helper';


class SaleSearchForm extends Component {
    constructor(props) {
        super(props);

        this.currentDate = new Date();

        let textCurrent = getTextByDate(this.currentDate);

        this.state = {
            sdate: textCurrent,
            edate: textCurrent
        };

        this.handleChange = this.handleChange.bind(this);
    }

    setDate(day) {
        var startDate;

        switch( day ){
            case 30:
            case 90:
                startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth()-(day/30), this.currentDate.getDate());
                break;
            default:
                startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate()-day);
                break;
        }

        this.setState({
            sdate: getTextByDate(startDate),
            edate: getTextByDate(this.currentDate)
        });
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        var params = {};

        params.sdate = this.state.sdate ? this.state.sdate + ' 00:00:00' : '';
        params.edate = this.state.edate ? this.state.edate + ' 23:59:59' : '';

        this.props.onSearch(params);

        return false;
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <div className="row">
                    <div className="col-lg-12 col-xl-auto col-form-label">조회기간(이용일)</div>
                    <div className="col-lg-12 col-xl-auto">
                        <div className="form-row">
                            <div className="col-12 col-lg-auto mb-1">
                                <div className="btn-group">
                                    <button type="button" className="btn btn-secondary" onClick={() => this.setDate(0)}>오늘</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => this.setDate(6)}>1주일</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => this.setDate(30)}>1개월</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => this.setDate(90)}>3개월</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => this.setDate(365)}>1년</button>
                                </div>
                            </div>
                            <div className="col-auto mb-1">
                                <div className="form-row">
                                    <div className="col-auto">
                                        <input type="date" name="sdate" className="form-control" placeholder="시작일" value={this.state.sdate} onChange={this.handleChange} />
                                    </div>
                                    <div className="col-auto">
                                        <input type="date" name="edate" className="form-control d-inline-block" placeholder="종료일" value={this.state.edate} onChange={this.handleChange} />
                                    </div>
                                    <div className="col-auto">
                                        <button type="submit" className="btn btn-primary">조회</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

export default SaleSearchForm;