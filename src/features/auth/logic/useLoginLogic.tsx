import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { type LoginSchemaType, loginSchema } from "../schema/loginSchema";
import useLogin from "../api/useLogin";
import { toast } from "sonner";
import { useAuth } from "../../../store/AuthProvider";

const useLoginLogic = () => {
  const { isPending, mutateAsync } = useLogin();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/my-profile";
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const response = await mutateAsync(data);
      if (response?.status) {
        toast.success(response?.message);
        login(response.data, data.rememberMe);
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isPending,
    control,
  };
};

export default useLoginLogic;
