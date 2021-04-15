import React, { Component } from 'react';

class Pagination extends Component {

    changePage(page, event) {
        event.preventDefault();

        this.props.onChange(page);
    }


    render() {

        const { page, total, group } = this.props;

        if( total <= 1 ){
            return '';
        }

        let start = 1;
        let half = Math.floor(group / 2);

        if( total > group && page > group - half ){
            start = Math.min(total + 1 - group, page - half);
        }

        let end = Math.min(total, start + group - 1);

        let items = [];

        for( let i = start; i <= end; i++ ){
            var classname = 'page-item'+(i === page ? ' active' : '');
            items.push(
                <li key={'page_'+i} className={classname}><a className="page-link" href="javascript:;" onClick={(e) => this.changePage(i, e)}>{i}</a></li>
            );
        }

        return (
            <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                    <li className="page-item">
                        <a className="page-link" aria-label="first" href="javascript:;" onClick={(e) => this.changePage(1, e)}>
                            <span aria-hidden="true">&laquo;</span>
                            <span className="sr-only">First</span>
                        </a>
                    </li>
                    {items}
                    <li className="page-item">
                        <a className="page-link" aria-label="last" href="javascript:;" onClick={(e) => this.changePage(total, e)}>
                            <span aria-hidden="true">&raquo;</span>
                            <span className="sr-only">Last</span>
                        </a>
                    </li>
                </ul>
            </nav>
        );
    }
};

Pagination.defaultProps = {
    page: 1,
    total: 0,
    group: 5,
    onChange: function(){}
}

export default Pagination