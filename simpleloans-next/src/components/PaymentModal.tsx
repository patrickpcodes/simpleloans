"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import PaymentForm, {
  PaymentPayTodayValues,
} from "@/app/(rs)/payments/form/PaymentForm";
import { Payment } from "@/zod-schemas/payment";

interface StyledPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment;
  paymentPayTodayValues?: PaymentPayTodayValues;
}

export function PaymentModal({
  isOpen,
  onClose,
  payment,
  paymentPayTodayValues,
}: StyledPaymentModalProps) {
  // function onSubmit(data: Payment) {
  //   console.log("In Payment Modal");
  //   console.log(data);
  //   //onClose();
  // }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Make a Payment
          </DialogTitle>
        </DialogHeader>
        <PaymentForm
          payment={payment}
          paymentPayTodayValues={paymentPayTodayValues}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
