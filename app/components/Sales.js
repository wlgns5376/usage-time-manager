import React, { Component } from 'react';
import { numberFormat, getTextByDate } from './helper';
import SaleSearchForm from './SaleSearchForm';
import Pagination from './Pagination';
import Loading from './Loading';

const SaleRow = (props) => {
    const { sale, no } = props;

    var sdate = new Date(sale.starttime);

    return (
        <tr>
            <th scope="row">{no}</th>
            <td>{sale.name}</td>
            <td>{getTextByDate(sdate)}</td>
            <td>{sale.usagetime}</td>
            <td>{numberFormat(sale.amount)}원</td>
        </tr>
    );
}

class Sales extends Component {
    constructor(props) {
        super(props);

        let today = getTextByDate(new Date());

        this.state = {
            loaded: true,
            sales: [],
            wheres: {
                status: 2,
                $and: [
                    {starttime: {$gte: (new Date(today+' 00:00:00')).getTime()}},
                    {starttime: {$lte: (new Date(today+' 23:59:59')).getTime()}}
                ],
            },
            page: 1,
            count: 10,
            total: 0,
            total_amount: 0,
            offset: 0
        }
    }
    componentDidMount() {
        this.find(this.state.wheres, this.state.page, this.state.count);
    }

    handleSearch(params) {
        this.showLoading();

        var sdate = params.sdate ? new Date(params.sdate) : '';
        var edate = params.edate ? new Date(params.edate) : '';
        var newWheres = this.state.wheres;
        var findAnd = [];

        if( sdate ){
            findAnd.push({starttime: { $gte: sdate.getTime() } });
        }
        if( edate ){
            findAnd.push({starttime: { $lte: edate.getTime() } });
        }

        if( findAnd.length > 0 ){
            newWheres.$and = findAnd;
        }

        this.find(newWheres, 1, this.state.count);

    }

    showLoading() {
        this.setState({
            loaded: true
        });
    }

    handleChangePage(page) {
        this.showLoading();
        this.find(this.state.wheres, page, this.state.count);
    }

    getTotalAndSum(wheres) {
        return new Promise((resolve, reject) => {
            this.props.db
                    .find(wheres, (err, docs) => {

                        const total = docs.length;
                        let sum = 0;

                        docs.forEach((sale, index) => {
                            sum += parseInt(sale.amount);
                        });

                        resolve({
                            total: total,
                            sum: sum
                        });
                    })
        });
    }

    findSalesAsync(wheres, offset, count) {
        return new Promise((resolve, reject) => {
            this.props.db
                    .find(wheres)
                    .sort({ endtime: -1 })
                    .skip(offset)
                    .limit(count)
                    .exec((err, docs) => {
                        resolve(docs);
                    });
        });
    }

    find = async (wheres, page, count) => {
        const offset = page * count - count;

        const { total, sum } = await this.getTotalAndSum(wheres);
        const sales = await this.findSalesAsync(wheres, offset, count);

        this.setState({
            loaded: false,
            sales: sales,
            wheres: wheres,
            page: page,
            count: count,
            total: total,
            total_amount: sum,
            offset: offset
        });
    }

    render() {
        const { sales, count, page, total, total_amount, offset, loaded } = this.state;

        let Rows = '';
        let no = total - offset;

        const pageTotal = total > 0 ? Math.ceil(total/count) : 0;

        console.log('render sales', total);

        if( !loaded ){
            Rows = sales.map((sale) => {
                return (
                    <SaleRow key={'sale_'+sale._id} sale={sale} no={no--} />
                );
            });
        }

        return (
            <div className="container position-relative">
                <div className="row">
                    <div className="col-12 sales-search-wrap mb-4">
                        <SaleSearchForm onSearch={this.handleSearch.bind(this)} />
                    </div>
                    <div className="col-12">
                        <span>전체 <span className="text-danger">{total}</span>건</span>
                        <span className="px-1">/</span>
                        <span>결제액 <span className="text-danger">{numberFormat(total_amount)}</span>원</span>
                    </div>
                    <div className="col-12">
                        <table className="table table_sales">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">이름</th>
                                    <th scope="col">이용일</th>
                                    <th scope="col">이용시간(분)</th>
                                    <th scope="col">결제금액</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Rows}
                            </tbody>
                        </table>
                        <div>
                        {!loaded &&
                            <Pagination page={page} total={pageTotal} onChange={this.handleChangePage.bind(this)} />
                        }
                        </div>
                    </div>
                </div>
                <Loading show={loaded} />
            </div>
        );
    }
};

export default Sales;