import React, { Component } from 'react';
import RequestService from '../services/RequestService';
import { EndpointsEnum } from '../../config';

type TFilterState = {
  loading: boolean,
  error?: boolean,
  filterConfig: {[key:string]: any},
}

function withData(WrappedComponent, dataSource: Promise<{}>) {

  return class extends Component {
 
    public state: TFilterState;
    protected request = new RequestService();

    constructor(props) {
      super(props);

      this.handleChange = this.handleChange.bind(this);

      this.state = {
        loading: true,
        filterConfig: {
          level: 0,
          source: '',
          regularExpression: '*',
        }
      }
    }

    public async componentDidMount() {
       
      const filterResponse = await this.request.get(EndpointsEnum.CONFIGURATION);
      
      if(filterResponse) {
        this.setState({
          loading: false,
          error: false,
          filterConfig: filterResponse.data,
        })
      } else {
        this.setState({
          loading: false,
          error: true,
        })
      }
      

    }

    protected handleChange(state) {
      this.request.post(EndpointsEnum.CONFIGURATION, state);
    }

    render() {
      if(this.state.loading) {
        return <h1>Loading...</h1>
      } else if (!this.state.error && !this.state.loading) {
        return <WrappedComponent 
          handleChange={this.handleChange}
          level={this.state.filterConfig.level}
          source={this.state.filterConfig.source}
          regularExpression={this.state.filterConfig.regularExpression}
        />
      } else if (this.state.error) {
        
        return <h1>Connection Error...</h1>
      }
    }
  }
}

export default withData;