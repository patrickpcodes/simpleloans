"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  DollarSign,
  CreditCard,
  BanknoteIcon as Bank,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PaymentForm from "@/app/(rs)/payments/form/PaymentForm";
import { Payment } from "@/zod-schemas/payment";

interface StyledPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment;
}

export function PaymentModal({
  isOpen,
  onClose,
  payment,
}: StyledPaymentModalProps) {
  //   function onSubmit(data: PaymentFormValues) {
  //     console.log(data);
  //     onClose();
  //   }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Make a Payment
          </DialogTitle>
        </DialogHeader>
        <PaymentForm payment={payment} />
      </DialogContent>
    </Dialog>
  );
}
