import { Button } from './button'
import { Modal } from './modal'

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Подтверждение", 
  message = "Вы уверены?",
  confirmText = "Удалить",
  cancelText = "Отмена",
  variant = "destructive"
}) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="p-6">
        <p className="text-gray-300 mb-6">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-600 text-gray-300"
          >
            {cancelText}
          </Button>
          <Button 
            variant={variant}
            onClick={handleConfirm}
            className={variant === "destructive" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export { ConfirmModal }