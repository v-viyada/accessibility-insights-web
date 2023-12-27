// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { fireEvent, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { NewTabLinkWithTooltip } from 'common/components/new-tab-link-with-tooltip';
import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { ExternalLink, ExternalLinkDeps } from '../../../../../common/components/external-link';
import '@testing-library/jest-dom';

//jest.mock('common/components/new-tab-link-with-tooltip');
describe('ExternalLink', () => {
    // mockReactComponents([NewTabLinkWithTooltip]);
    const href = 'about:blank';
    const title = 'TITLE';
    const text = 'LINK TEXT';
    const openExternalLink = jest.fn();

    const deps = {
        actionInitiators: {
            openExternalLink,
        },
    } as ExternalLinkDeps;

    it('renders Link', () => {
        const renderResult = render(
            <ExternalLink deps={deps} href={href} title={title}>
                {text}
            </ExternalLink>,
        );
        const link = renderResult.getByRole('link');
        //expect(link.exists()).toEqual(true);
        expect(link).toBeInTheDocument();
        //expect(link.type()).toEqual(NewTabLinkWithTooltip);
        //expect(link.href).toEqual(href);
        expect(link).toHaveAttribute('href', href);
        //expect(link.tooltipContent).toEqual(title);
        // expect(link).toHaveAttribute('tooltipContent', title);
        //expect(link.children.asFragment()).toEqual(text);
        expect(link.textContent).toEqual(text);

        const tooltip = renderResult.getByText(title);
        expect(tooltip).toBeInTheDocument();
    });

    it('triggers initiator on click', async () => {
        const renderResult = render(
            <ExternalLink deps={deps} href={href} title={title}>
                {text}
            </ExternalLink>,
        );
        await userEvent.click(renderResult.getByRole('link'));
        expect(openExternalLink).toHaveBeenCalledTimes(1);
    });
});
