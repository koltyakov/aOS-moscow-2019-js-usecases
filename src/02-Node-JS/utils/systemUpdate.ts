import { sp, Web, Item, ListItemFormUpdateValue, PermissionKind } from '@pnp/sp';
import { format, addMinutes } from 'date-fns';

export const dateToFormStringAutoOffset = async (dateTime: Date | string, web: Web = sp.web): Promise<string> => {
  const { Bias: offsetBias } = await web.regionalSettings.timeZone.usingCaching().get().then(t => t.Information);
  return dateToFormString(dateTime, offsetBias);
};

export const dateToFormString = (dateTime: Date | string, offsetBias: number = 0): string => {
  dateTime = addMinutes(new Date(dateTime), new Date().getTimezoneOffset() - offsetBias);
  return format(dateTime, 'M/D/YYYY h:m A');
};

export const loginToFormString = (userName: string): string => {
  return JSON.stringify([{ Key: userName, IsResolved: true }]);
};

export const systemUpdate = async (item: Item, formUpdateValues: ListItemFormUpdateValue[], eTag: string = null) => {

  const web = new Web(item.toUrl().split('_api')[0]);

  const [ permissions, { Editor: { Name }, Modified, 'odata.etag': currentETag } ] = await Promise.all([
    item.usingCaching().getCurrentUserEffectivePermissions(),
    item.select('Modified,Editor/Name').expand('Editor').get()
  ]);

  // const permissions = await item.usingCaching().getCurrentUserEffectivePermissions();
  if (!item.hasPermissions(permissions, PermissionKind.ManagePermissions)) {
    throw new Error('403 - Access denied. Full Control permissions level is required for performing this operation.');
  }

  // const { Editor: { Name }, Modified, 'odata.etag': currentETag } = await item.select('Modified,Editor/Name').expand('Editor').get();

  const sysUpdateData = [
    { FieldName: 'Editor', FieldValue: loginToFormString(Name) },
    { FieldName: 'Modified', FieldValue: await dateToFormStringAutoOffset(Modified, web) }
  ];

  if (eTag && eTag !== currentETag) {
    throw new Error(`412 - The request ETag value '"${eTag}"' does not match the object's ETag value '"${currentETag}"'.`);
  }

  const result = await item.configure({
    headers: {
      'Accept': 'application/json;odata=minimalmetadata'
    }
  }).validateUpdateListItem(formUpdateValues.concat(sysUpdateData), true);

  const errors = result
    .filter(field => field.ErrorMessage !== null)
    .filter(field => {
      return !(field.FieldName === 'Editor' && field.ErrorMessage === 'Multiple entries matched, please click to resolve.');
    });
  if (errors.length > 0) {
    throw new Error(JSON.stringify(errors));
  }

  return result;

};
