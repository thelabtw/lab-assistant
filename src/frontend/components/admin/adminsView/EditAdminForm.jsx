'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';
import _ from 'underscore';
import EditAdminFields from './EditAdminFields.jsx';
import validator from '../../../services/adminValidator';

export default class EditAdminForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.admin.id,
            invalidFields: [],
            fieldValues: props.admin
        };
    }

    isValidationError(fieldName) {
      return this.state.invalidFields.includes(fieldName);
    }

    isNewUser() {
        return this.props.admin === {};
    }

    passwordChanged() {
        return this.state.fieldValues.password;
    }

    passwordConfirmedTest() {
        return this.state.fieldValues.confirmedPassword !==
            this.state.fieldValues.password ? ['confirmedPassword'] : [];
    }

    saveChanges() {
        let admin = Object.assign({}, this.props.admin, this.state.fieldValues);
        let errors;
        if(this.passwordChanged()) {

            errors = (validator.isValid(admin));
            errors = errors.concat(this.passwordConfirmedTest());
        } else {
            errors = (validator.isValidWithoutPassword(admin));
        }

        this.setState({invalidFields: errors});
        if(errors.length === 0) {
            this.props.onSuccess();
            this.props.onSave(admin);
        }
    }

    onChange(fieldName) {
        let editAdminComponent = this;

        return function(event) {
            let newValue = {[fieldName] : event.target.value};
            let newFieldValues = Object.assign({}, editAdminComponent.state.fieldValues, newValue);
            editAdminComponent.setState({
                fieldValues: newFieldValues
            });
        };
    }

    render() {
        return (
            <section className="form-container">
                <header className="details-header">
                    <span className='title'>
                        Edit details for {this.props.admin.email}
                    </span>
                    <span className='actions'>
                        <button className="save" onClick={this.saveChanges.bind(this)}>Save</button>
                    </span>
                </header>
                <EditAdminFields onChange={this.onChange.bind(this)}
                              invalidFields={this.state.invalidFields}
                              formValues={this.state.fieldValues}
                />
            </section>
        )
    }
}
