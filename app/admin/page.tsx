"use client";

import PageSection from "@/components/page-section";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import { useEffect } from "react";
import CurrencyInfo from "./currency-info";
import usePass from "@/hooks/usePass";
import PassPage from "./pass-page";

function CashRegisterPage() {
  const { data, fetchData }: { data: CashRegister[]; fetchData: () => void } =
    useCrudOperations("/api/cash-register");
  const {isSave, setPass, pass} = usePass(data)

  const cashregister = data[0] || {}
  const { primary, secondary } = cashregister?.balances || {
    primary: {amount: 0, currency: "USD"},
    secondary: {amount: 0, currency: "CUP"},
  };
  const exchange = data[0]?.exchangeRate || 0

  useEffect(fetchData, []);

  if (!isSave && data[0]?.password) {
    return (
      <PassPage pass={pass} setPass={setPass}/>
    );
  }

  return (
    <PageSection title="Fondo de Caja">
      <CurrencyInfo primary={primary} secondary={secondary} exchange={exchange} id={cashregister._id} password={cashregister.password} />
    </PageSection>
  );
}

export default CashRegisterPage;
