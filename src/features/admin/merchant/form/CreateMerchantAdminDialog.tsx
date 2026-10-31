import { CreateMerchantAdminData, MerchantAdmin } from "../types/merchant-admin.types";
import MerchantAdminFormDialog from "./MerchantAdminFormDialog";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateMerchantAdminData) => Promise<MerchantAdmin>;
}

const CreateMerchantAdminDialog = ({ open, onClose, onCreate }: Props) => (
  <MerchantAdminFormDialog
    open={open}
    admin={null}
    onClose={onClose}
    onCreate={onCreate}
  />
);

export default CreateMerchantAdminDialog;