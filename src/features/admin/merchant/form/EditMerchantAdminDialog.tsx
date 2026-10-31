import { MerchantAdmin, UpdateMerchantAdminData } from "../types/merchant-admin.types";
import MerchantAdminFormDialog from "./MerchantAdminFormDialog";

interface Props {
  open: boolean;
  admin: MerchantAdmin;
  allowPasswordChange?: boolean;
  confirmBeforeSave?: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: UpdateMerchantAdminData) => Promise<MerchantAdmin>;
}

const EditMerchantAdminDialog = ({
  open,
  admin,
  allowPasswordChange,
  confirmBeforeSave,
  onClose,
  onUpdate,
}: Props) => (
  <MerchantAdminFormDialog
    open={open}
    admin={admin}
    allowPasswordChange={allowPasswordChange}
    confirmBeforeSave={confirmBeforeSave}
    onClose={onClose}
    onUpdate={onUpdate}
  />
);

export default EditMerchantAdminDialog;