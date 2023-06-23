import { IbanFormAction } from '../../../model/Iban';

type Props = {
  formAction: string;
};

const AddEditIbanForm = ({ formAction }: Props) => {
  // eslint-disable-next-line sonarjs/prefer-immediate-return
  const component = formAction === IbanFormAction.Create ? <>AddForm</> : <>EditForm</>;
  return component;
};

export default AddEditIbanForm;
