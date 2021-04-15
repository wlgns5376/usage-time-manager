import React, { Component } from 'react';

function caculateUsageTime(start){
    const current = (new Date()).getTime();

    return Math.floor((current-start)/1000);
}

class Timer extends Component {
    constructor(props) {
      super(props);

      this.state = {
        time: 0,
        tock: 1
      }

    }

    componentDidMount() {
      this.timerID = setInterval(
        () => this.tick(),
        1000
      );
    }

    componentWillUnmount() {
      clearInterval(this.timerID);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            time: caculateUsageTime(nextProps.start)
        }
    }

    tick() {
        if( this.props.start > 0 ){
            const hour = Math.floor(this.state.time/3600);
            if( hour > 0 && this.state.time%3600 === 0 ){
                this.props.onChangeHour();
            }
            this.setState((prevState, props) => ({
                time: prevState.time + 1,
                tock: !prevState.tock
            }));
        }
    }

    getTimeAtText() {
        const time = this.state.time;

        if( time === 0 || this.props.start === 0 ){
            return {
                hour: '0',
                minute: '00'
            };
        }

        const hour = Math.floor(time/3600);
        const minute = Math.floor(time%3600/60);

        return {
            hour: hour,
            minute: (minute >= 10 ? minute : '0'+minute)
        }
    }

    render() {
        const time = this.getTimeAtText();

        this.outputTime = time.hour+':'+time.minute;

        const tockStyle = {
            visibility: this.state.tock ? 'visible': 'hidden'
        };

        return (
            <span className="text-timer text-danger">
                {time.hour}
                <span>:</span>
                {time.minute}
            </span>
        );
    }
}
Timer.defaultProps = {
    onChangeHour: function(){}
}

export default Timer;