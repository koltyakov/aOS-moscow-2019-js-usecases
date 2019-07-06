import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration, PropertyPaneSlider, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { sp } from '@pnp/sp';

import * as strings from 'AOsMoscowVoteWebPartStrings';
import Chart, { IProps as IComponentProps } from './components/Chart/index';

export interface IWebPartProps {
  webpartTitle: string;
  refreshInSeconds: number;
}

export default class aOSMoscowWebPart extends BaseClientSideWebPart<IWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IComponentProps> = React.createElement(
      Chart, {
        webAbsUrl: this.context.pageContext.web.absoluteUrl,
        refreshInSeconds: this.properties.refreshInSeconds,
        title: this.properties.webpartTitle
      }
    );
    ReactDom.render(element, this.domElement);
  }

  public onInit(): Promise<void> {
    return super.onInit().then(() => {
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [{
        header: {
          description: strings.PropertyPaneDescription
        },
        groups: [{
          groupName: strings.BasicGroupName,
          groupFields: [
            PropertyPaneTextField('webpartTitle', {
              label: strings.TitleFieldLabel
            }),
            PropertyPaneSlider('refreshInSeconds', {
              label: strings.RefreshFieldLabel,
              min: 0,
              max: 60,
              step: 5,
              value: this.properties.refreshInSeconds
            })
          ]
        }]
      }]
    };
  }
}
