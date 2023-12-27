// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PrimaryButton } from '@fluentui/react';
import { Checkbox } from '@fluentui/react';
import { fireEvent, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import * as React from 'react';
import { getMockComponentClassPropsForCall, mockReactComponents } from 'tests/unit/mock-helpers/mock-module-helpers';
import { NewTabLink } from '../../../../../common/components/new-tab-link';
import { PrivacyStatementPopupText } from '../../../../../common/components/privacy-statement-text';
import { TelemetryNotice } from '../../../../../common/components/telemetry-notice';
import {
    SetTelemetryStateMessageCreator,
    TelemetryPermissionDialog,
    TelemetryPermissionDialogDeps,
    TelemetryPermissionDialogProps,
} from '../../../../../common/components/telemetry-permission-dialog';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import '@testing-library/jest-dom';

jest.mock('../../../../../common/components/privacy-statement-text');
jest.mock('../../../../../common/components/telemetry-notice');
describe('TelemetryPermissionDialogTest', () => {
    mockReactComponents([TelemetryNotice, PrivacyStatementPopupText]);
    let userConfigMessageCreatorStub: SetTelemetryStateMessageCreator;
    let setTelemetryStateMock: () => null;

    beforeEach(() => {
        userConfigMessageCreatorStub = {} as UserConfigMessageCreator;
        setTelemetryStateMock = jest.fn();
        userConfigMessageCreatorStub.setTelemetryState = setTelemetryStateMock;
    });

    test('render null if not first time', () => {
        const props: TelemetryPermissionDialogProps = {
            isFirstTime: false,
        } as TelemetryPermissionDialogProps;

        const component = new TelemetryPermissionDialog(props);
        expect(component.render()).toBe(null);
    });

    test('render dialog', () => {
        const props: TelemetryPermissionDialogProps = {
            deps: {
                LinkComponent: NewTabLink,
            } as TelemetryPermissionDialogDeps,
            isFirstTime: true,
        };

        const wrapper = render(<TelemetryPermissionDialog {...props} />);
        expect(wrapper.asFragment()).toMatchSnapshot();

        const checkBox = wrapper.getByRole('checkbox');
        expect(checkBox).toBeChecked();
        // expect(wrapper.state()).toMatchObject({ isEnableTelemetryChecked: true });

        const telemetryNotice = getMockComponentClassPropsForCall(TelemetryNotice);
        expect(telemetryNotice.deps.LinkComponent).toBe(props.deps.LinkComponent);

        const privacyStatementPopupText = getMockComponentClassPropsForCall(PrivacyStatementPopupText);
        expect(privacyStatementPopupText.deps.LinkComponent).toBe(props.deps.LinkComponent);
    });

    test('toggle check box', () => {
        const props: TelemetryPermissionDialogProps = {
            deps: {} as TelemetryPermissionDialogDeps,
            isFirstTime: true,
        };

        const wrapper = render(<TelemetryPermissionDialog {...props} />);
        const checkBox = wrapper.getByRole('checkbox');
        expect(checkBox).toBeChecked();
        //expect(wrapper.state()).toMatchObject({ isEnableTelemetryChecked: true });
        fireEvent.click(checkBox);
        //checkBox.props().onChange(null, false);
        expect(checkBox).not.toBeChecked();
        //expect(wrapper.state()).toMatchObject({ isEnableTelemetryChecked: false });
        fireEvent.click(checkBox);
        //checkBox.props().onChange(null, true);
        expect(checkBox).toBeChecked();
        //expect(wrapper.state()).toMatchObject({ isEnableTelemetryChecked: true });
    });

    test('button click', async () => {
        const props: TelemetryPermissionDialogProps = {
            deps: {
                userConfigMessageCreator: userConfigMessageCreatorStub,
            } as TelemetryPermissionDialogDeps,
            isFirstTime: true,
        };

        const wrapper = render(<TelemetryPermissionDialog {...props} />);
        //const button = wrapper.querySelector(PrimaryButton);
        await userEvent.click(wrapper.getByRole('button'));
        expect(setTelemetryStateMock).toHaveBeenCalledTimes(1);
    });
});
