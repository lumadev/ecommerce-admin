import { MerchantAdmin, UpdateMerchantAdminData } from "../types/merchant-admin.types";
import MerchantAdminFormDialog from "./MerchantAdminFormDialog";

interface Props {
  open: boolean;
  admin: MerchantAdmin;
  onClose: () => void;
  onUpdate: (id: string, data: UpdateMerchantAdminData) => Promise<MerchantAdmin>;
}

const EditMerchantAdminDialog = ({ open, admin, onClose, onUpdate }: Props) => (
  <MerchantAdminFormDialog
    open={open}
    admin={admin}
    onClose={onClose}
    onUpdate={onUpdate}
  />
);

export default EditMerchantAdminDialog;