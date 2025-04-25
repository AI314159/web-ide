import { Button } from "@/components/button";
import { signIn } from "@/lib/auth";

export const SignInButton = (props) => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn();
      }}
    >
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        {...props}
      >
        Sign in with GitHub
      </Button>
    </form>
  );
};