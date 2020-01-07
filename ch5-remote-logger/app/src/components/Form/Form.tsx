import React, { Component } from 'react';
import withData from '../../wrappers/withData';

import './Form.css';
import { ElogLevel } from "../../../../api/src/enums";

type TFormProps = {
    level: number,
    regularExpression: string,
    source: string,
    handleChange?: (state) => void
}

export type PlaceHolderMessage = {
    message: string;
    level: ElogLevel;
    date: Date;
};


type TFormState = TFormProps;

class Form extends Component<TFormProps> {

    public state: TFormState;

    constructor(props) {
        super(props);

        this.handleOnChange = this.handleOnChange.bind(this);

        this.state = {
            ...this.props
        }
    }

    protected handleOnChange(event) {
        const name = event.target.name || '';
        this.handleUpdate(name, event);
    }

    protected handleUpdate(key, event) {
        const newState = {

            ...this.state,
            [key]: event.target.value,
        };

        if (this.props.handleChange) {
            this.props.handleChange(newState);
        }

        this.setState(newState);
    }

    render() {
        return (
            <div className="main-wrapper">
                <h3 className="description">Use the following options to filter console messages</h3>
                <div className="flex-wrapper">
                    <div className="form-section">
                        <h3>Filter:</h3>
                        <select 
                                className="level-select" 
                                name="level" 
                                defaultValue={this.props.level + ''}
                                onChange={this.handleOnChange}
                        >
                            <option className="option-logs" value="0">Default</option>
                            <option className="option-info" value="1">Info</option>
                            <option className="option-warn" value="2">Warn</option>
                            <option className="option-error" value="3">Error</option>
                        </select>
                    </div>
                    <div className="form-section">
                        <h3>Source:</h3>
                        <input
                            className="source-input"
                            defaultValue={this.props.source + ''}
                            name="source"
                            onChange={this.handleOnChange}
                            placeholder="Source"
                            type="text"
                        />
                    </div>
                    <div className="form-section">
                        <h3>Regular Expression</h3>
                        <textarea
                            className="reg-exp-input"
                            defaultValue={this.props.regularExpression + ''}
                            name="regularExpression"
                            onChange={this.handleOnChange}
                            placeholder="/RegExp/i"
                        />

                    </div>
                </div>
                
            </div>
        );
    }
}

export default withData(Form, new Promise(() => {
}));
