export default interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}