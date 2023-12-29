// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ITextField } from '@fluentui/react';
import { act, createEvent, fireEvent, render, RenderResult, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import styles from 'common/components/selector-input-list.scss';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';
import { SelectorInputList, SelectorInputListProps } from '../../../../../common/components/selector-input-list';
import '@testing-library/jest-dom';

describe('SelectorInputListTest', () => {
    test('render with list items', () => {
        const givenInput = 'include';
        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            inputType: givenInput,
            inspectMode: null,
            items: [['test-item'], ['another-test-item']],
            onAddSelector: null,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };

        const renderResult = render(<SelectorInputList {...props} />);
        genericRenderTests(renderResult, props);
    });

    test('render without list items', () => {
        const givenInput = 'include';
        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            inputType: givenInput,
            inspectMode: null,
            items: [],
            onAddSelector: null,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };
        const renderResult = render(<SelectorInputList {...props} />);
        genericRenderTests(renderResult, props);
    });

    test('render with instructions paragraph', () => {
        const givenInput = 'include';
        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            inputType: givenInput,
            inspectMode: null,
            items: [],
            instructions: getParagraph(),
            onAddSelector: null,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };
        const renderResult = render(<SelectorInputList {...props} />);
        genericRenderTests(renderResult, props);
        expect(renderResult.container.querySelector('.test-paragraph').getAttribute).toBeDefined();
    });

    test('add selector with no space after semicolon', () => {
        const addSelectorMock = Mock.ofInstance((event: React.MouseEvent<HTMLButtonElement>, inputType: string, selector: string[]) => {});
        const givenInput = 'include';
        const givenSelector = 'iframe;selector';
        const parsedSelector = ['iframe', 'selector'];
        addSelectorMock.setup((add) => add(It.isAny(), It.isValue(givenInput), It.isValue(parsedSelector))).verifiable(Times.once());
        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [],
            inputType: givenInput,
            inspectMode: null,
            onAddSelector: addSelectorMock.object,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };
        const renderResult = render(<TestableSelectorInputList {...props} />);
        genericAddSelectorTests(renderResult, addSelectorMock, givenSelector);
    });

    test('add selector with multiple separators', () => {
        const addSelectorMock = Mock.ofInstance((event: React.MouseEvent<HTMLButtonElement>, inputType: string, selector: string[]) => {});
        const givenSelector = 'iframe;selector;selectorAgain  ;    lastSelector';
        const parsedSelector = ['iframe', 'selector', 'selectorAgain', 'lastSelector'];
        const givenInput = 'include';
        addSelectorMock.setup((add) => add(It.isAny(), It.isValue(givenInput), It.isValue(parsedSelector))).verifiable(Times.once());
        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [],
            inputType: givenInput,
            inspectMode: null,
            onAddSelector: addSelectorMock.object,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };
        const renderResult = render(<TestableSelectorInputList {...props} />);
        genericAddSelectorTests(renderResult, addSelectorMock, givenSelector);
    });

    test('change inspection mode', () => {
        const changeInspectionMock = Mock.ofInstance((event: React.MouseEvent<HTMLButtonElement>, inspectMode: string) => {});
        const givenMode = 'scopingAddInclude';
        const givenInput = 'include';
        changeInspectionMock.setup((add) => add(It.isAny(), It.isValue(givenMode))).verifiable(Times.once());
        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [],
            inputType: givenInput,
            inspectMode: givenMode,
            onAddSelector: null,
            onDeleteSelector: null,
            onChangeInspectMode: changeInspectionMock.object,
        };
        const renderResult = render(<SelectorInputList {...props} />);
        genericChangeInspectionModeTests(renderResult, changeInspectionMock);
    });

    test('delete selector with no space after semicolon', () => {
        const deleteSelectorMock = Mock.ofInstance(
            (event: React.MouseEvent<HTMLButtonElement>, inputType: string, selector: string[]) => {},
        );
        const givenInput = 'include';
        const parsedSelector = ['iframe', 'selector'];

        deleteSelectorMock.setup((add) => add(It.isAny(), It.isValue(givenInput), It.isValue(parsedSelector))).verifiable(Times.once());
        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [parsedSelector],
            inputType: givenInput,
            inspectMode: null,
            onAddSelector: null,
            onDeleteSelector: deleteSelectorMock.object,
            onChangeInspectMode: null,
        };
        const renderResult = render(<SelectorInputList {...props} />);
        genericDeleteSelectorTests(renderResult, deleteSelectorMock, props);
    });

    test('add selector button disabled after entering duplicate selector', () => {
        const givenInput = 'include';
        const givenSelector = 'iframe; selector';
        const parsedSelector = ['iframe', 'selector'];

        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [parsedSelector],
            inputType: givenInput,
            inspectMode: null,
            onAddSelector: null,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };
        const renderResult = render(<TestableSelectorInputList {...props} />);
        genericButtonStateTests(renderResult, givenSelector, true);
    });

    test('add selector button disabled after entering blank selector', () => {
        const givenInput = 'include';
        const givenSelector = '';

        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [],
            inputType: givenInput,
            inspectMode: null,
            onAddSelector: null,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };
        const renderResult = render(<TestableSelectorInputList {...props} />);
        genericButtonStateTests(renderResult, givenSelector, true);
    });

    test('add selector button enabled after entering valid selector', () => {
        const givenInput = 'include';
        const givenSelector = 'second-selector';
        const parsedSelector = ['iframe', 'selector'];

        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [parsedSelector],
            inputType: givenInput,
            inspectMode: null,
            onAddSelector: null,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };
        const renderResult = render(<TestableSelectorInputList {...props} />);
        genericButtonStateTests(renderResult, givenSelector, false);
    });

    test('componentDidUpdate updates state when props have changed', () => {
        const updatedSelector = ['iframe; selector'];
        const givenInput = 'include';
        const givenSelector = 'selector';
        const previousProps: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [],
            inputType: givenInput,
            inspectMode: null,
            onAddSelector: null,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };

        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [updatedSelector],
            inputType: givenInput,
            inspectMode: null,
            onAddSelector: null,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };
        const { rerender, getByPlaceholderText, container } = render(<TestableSelectorInputList {...props} />);
        const button = container.querySelector('.textboxAddSelectorButton');
        expect(button).toBeDisabled();
        // const firstState = (renderResult.instance() as TestableSelectorInputList).state.isTextFieldValueValid;
        // (renderResult.instance() as TestableSelectorInputList).setTextFieldValue(givenSelector);
        // (renderResult.instance() as TestableSelectorInputList).componentDidUpdate(previousProps);
        const inputText = getByPlaceholderText('Enter element selector here');
        fireEvent.change(inputText, { target: { value: givenSelector } });
        //const secondState = (renderResult.instance() as TestableSelectorInputList).state.isTextFieldValueValid;
        act(() => {
            rerender(<TestableSelectorInputList {...previousProps} />);
        });
        expect(button).not.toBeDisabled();
        // expect(secondState).toEqual(!firstState);
    });

    test("componentDidUpdate doesn't update state when the props haven't changed ", () => {
        const givenInput = 'include';
        const previousProps: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [],
            inputType: givenInput,
            inspectMode: null,
            onAddSelector: null,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };

        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [],
            inputType: givenInput,
            inspectMode: null,
            onAddSelector: null,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };
        //const renderResult = render(<TestableSelectorInputList {...props} />);
        //const firstState = (renderResult.instance() as TestableSelectorInputList).state.isTextFieldValueValid;
        const { rerender, container } = render(<TestableSelectorInputList {...props} />);
        const button = container.querySelector('.textboxAddSelectorButton');
        expect(button).toBeDisabled();
        // (renderResult.instance() as TestableSelectorInputList).componentDidUpdate(previousProps);
        // const secondState = (renderResult.instance() as TestableSelectorInputList).state.isTextFieldValueValid;
        // expect(secondState).toEqual(firstState);
        act(() => {
            rerender(<TestableSelectorInputList {...previousProps} />);
        });
        expect(button).toBeDisabled();
    });

    test('restore sets textfield value to initial value upon entering a valid selector', async () => {
        const givenInput = 'include';
        const addSelectorMock = Mock.ofInstance((event: React.MouseEvent<HTMLButtonElement>, inputType: string, selector: string[]) => {});
        const givenSelector = 'selector';
        const parsedSelector = ['selector'];
        addSelectorMock.setup((add) => add(It.isAny(), It.isValue(givenInput), It.isValue(parsedSelector))).verifiable(Times.once());
        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [],
            inputType: givenInput,
            inspectMode: null,
            onAddSelector: addSelectorMock.object,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };

        const renderResult = render(<TestableSelectorInputList {...props} />);
        //(renderResult.instance() as TestableSelectorInputList).setTextFieldValue(givenSelector);
        //renderResult.setState({ isTextFieldValueValid: true, value: givenSelector });
        const inputText = renderResult.getByPlaceholderText('Enter element selector here') as HTMLInputElement;
        fireEvent.change(inputText, { target: { value: givenSelector } });
        //const textFieldBeforeAdd = renderResult.container.querySelector(TextField);
        //expect(textFieldBeforeAdd.asFragment().props.value).toBe(givenSelector);
        expect(inputText.value).toBe(givenSelector);
        const button = renderResult.container.querySelector('.textboxAddSelectorButton');
        await userEvent.click(button);
        //const textFieldAfterAdd = renderResult.container.querySelector(TextField);
        //expect(textFieldAfterAdd.asFragment().props.value).toBe('');
        expect(inputText.value).toBe('');
    });

    function genericButtonStateTests(result: RenderResult, givenSelector: string, expectedButtonDisabledValue: boolean): void {
        // (result.instance() as TestableSelectorInputList).setTextFieldValue(givenSelector);
        // result.setState({ isTextFieldValueValid: expectedStateValue });
        //  const button = result.container.querySelector(DefaultButton);
        const inputText = result.getByPlaceholderText('Enter element selector here');
        fireEvent.change(inputText, { target: { value: givenSelector } });
        const button = result.container.querySelector('.textboxAddSelectorButton');
        if (expectedButtonDisabledValue) {
            expect(button).toBeDisabled();
        } else {
            expect(button).not.toBeDisabled();
        }
        // expect(button.asFragment().props.disabled).toBe(!expectedStateValue);
    }

    function genericRenderTests(result: RenderResult, props: SelectorInputListProps): void {
        const textbox = result.getByRole('textbox', { name: props.subtitle });
        const title = result.container.querySelector('.' + styles.selectorInputTitle);
        expect(title.textContent).toBe(props.title);
        expect(textbox).toBeInTheDocument();
        props.items.forEach((item) => {
            item.forEach((selector) => {
                expect(result.getByText(selector)).toBeInTheDocument();
            });
        });
    }

    function genericAddSelectorTests(
        result: RenderResult,
        selectorMock: IMock<(event: React.MouseEvent<HTMLButtonElement>, inputType: string, selector: string[]) => void>,
        givenSelector: string,
    ): void {
        //(result.instance() as TestableSelectorInputList).setTextFieldValue(givenSelector);
        const inputText = result.getByPlaceholderText('Enter element selector here');
        fireEvent.change(inputText, { target: { value: givenSelector } });
        // result.setState({ isTextFieldValueValid: true });
        const button = result.container.querySelector('.textboxAddSelectorButton');
        const event = createEvent.click(button);
        fireEvent.click(button, event);
        selectorMock.verifyAll();
    }

    function genericDeleteSelectorTests(
        result: RenderResult,
        selectorMock: IMock<(event: React.MouseEvent<HTMLButtonElement>, inputType: string, selector: string[]) => void>,
        props: SelectorInputListProps,
    ): void {
        const itemList = result.getByRole('list');
        //const createdRow = render(itemList.asFragment().props.onRenderCell(itemList.asFragment().props.items[0]));
        const createdRow = within(itemList).getByText(props.items[0].join('; ')).closest('.selectorInputItemCell') as HTMLElement;
        const button = within(createdRow).getByRole('button');
        const event = createEvent.click(button);
        fireEvent.click(button, event);
        selectorMock.verifyAll();
        expect(result.container.querySelector('.ms-FocusZone')).toBeDefined();
    }

    function genericChangeInspectionModeTests(
        result: RenderResult,
        selectorMock: IMock<(event: React.MouseEvent<HTMLButtonElement>, inspectMode: string) => void>,
    ): void {
        const button = result.container.querySelector('.ms-Button--icon');
        const event = createEvent.click(button);
        fireEvent.click(button, event);
        selectorMock.verifyAll();
    }

    function getParagraph(): JSX.Element {
        return <p className="test-paragraph">Test</p>;
    }
});

class TestableSelectorInputList extends SelectorInputList {
    public setTextFieldValue(value: string): void {
        this.setTextField({ value, focus: () => {} } as ITextField);
    }
}
