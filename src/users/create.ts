
import { useForm } from "@mantine/form";
import { useCallback } from "react";
import { api } from "../services/api";


export default function UserCreatePage() {
  const form = useForm({
    mode: "uncontrolled",
    onSubmitPreventDefault: "always",
    initialValues: {
      name: "",
      email: "",
      document: "",
      birth_date: "",
      phone_number: "",
      address: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      birth_date: (value) =>
        /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(value)
          ? null
          : "Data de Nascimento Inválida",
    },
  });

  const handleForm = useCallback(async (values: typeof form.values) => {
    const [dia, mes, ano] = values.birth_date.split("/");
    const parsedDate = `${ano}-${mes}-${dia}T00:00:00Z`;
    const body = { ...values, birth_date: parsedDate };
    console.log(body);
    const { data } = await api.post("/produtos", body);
    console.log(data)
  }, []);


}
