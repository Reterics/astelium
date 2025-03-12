import CrudManager from '../../components/CrudManager';
import {useTranslation} from "react-i18next";
import {getTranslatedList} from "../../i18n/utils.ts";
import {streetTypes} from "../../utils/invoiceUtils.ts";

const InvoiceUsers = () => {
  const { t } = useTranslation();
  const translationPrefix = 'invoice.';

  return (
    <CrudManager
      title='Invoice Users'
      apiEndpoint='invoice-users'
      fields={[
        {
          key: 'supplier_name',
          label: 'Supplier Name',
          type: 'text',
          editable: true,
        },
        {
          key: 'supplier_tax_number',
          label: 'Tax Number',
          type: 'text',
          editable: true,
        },
        {
          key: 'supplier_post_code',
          label: 'ZIP Code',
          type: 'number',
          editable: true,
          visible: false,
        },
        {
          key: 'supplier_town',
          label: 'City',
          type: 'text',
          editable: true,
          visible: false,
        },
        {
          key: 'supplier_street_name',
          label: 'Street Name',
          type: 'text',
          editable: true,
          visible: false,
        },
        {
          key: 'supplier_street_category',
          label: 'Street Category',
          type: 'select',
          editable: true,
          visible: false,
          options: getTranslatedList(streetTypes, t, translationPrefix)
        },
        {
          key: 'supplier_address',
          label: 'Address',
          type: 'text',
          editable: true,
          visible: false,
        },
        {
          key: 'supplier_country',
          label: 'Country',
          type: 'text',
          editable: true,
          visible: false,
        },
        {
          key: 'supplier_bank_account_number',
          label: 'Bank Account',
          type: 'text',
          editable: true,
          visible: false,
        },
        {
          key: 'login',
          label: 'Login',
          type: 'text',
          editable: true,
          visible: true,
        },
        {
          key: 'password',
          label: 'Password',
          type: 'text',
          editable: true,
          visible: false,
        },
        {
          key: 'sign_key',
          label: 'Sign Key',
          type: 'text',
          editable: true,
          visible: true,
        },
        {
          key: 'exchange_key',
          label: 'Exchange Key',
          type: 'text',
          editable: true,
          visible: true,
        },
      ]}
    />
  );
};

export default InvoiceUsers;
