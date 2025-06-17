import React, { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { usePostHog } from "posthog-js/react";

const PosthogIdentification = () => {
  const { data: session } = useSession();
  const posthog = usePostHog();
  const user = session?.user;
  const name = session?.user?.name;
  const email = session?.user?.email;

  useEffect(() => {
    if (user) {
      posthog.identify(user.id, {
        email,
        name,
      });
    } else {
      posthog.reset();
    }
  }, [user, posthog]);
  return null;
};

export default PosthogIdentification;
