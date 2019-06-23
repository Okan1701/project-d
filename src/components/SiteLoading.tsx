import React, {Component} from 'react';

const brandImg = require("../images/brandOutlined.png");

interface IProps {
    loadingMsg: string
}

class SiteLoading extends Component<IProps, any> {

    public render() {
        return (
            <div>
                <br/>
                <div style={{width: "100%"}}>
                    <img src={brandImg} style={{width: "20%", height: "20%"}} className="rounded mx-auto d-block" alt="logo"/>
                </div>
                <div style={{marginTop: "20px"}} className="text-center">
                    <h3>Loading...</h3>
                    <strong>{this.props.loadingMsg}</strong><br/><br/>
                    <div style={{width: "25%", margin: "0 auto"}} className="bar" />
                </div>
            </div>
        );
    }
}

export default SiteLoading;