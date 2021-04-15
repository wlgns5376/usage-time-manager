import React, { Component } from 'react';

const Loading = (props) => {
    if( props.show ){
        return (
            <div className="loading-view d-flex justify-content-center align-items-center">
                <div className="p-5">
                    <i className="fa fa-spinner fa-pulse fa-4x"></i>
                </div>
            </div>
        )
    }


    return '';
}

export default Loading;
