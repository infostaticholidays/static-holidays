import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Account() {
const [user, setUser] = useState<any>(null);

useEffect(() => {
async function loadUser() {
const {
data: { user },
} = await supabase.auth.getUser();

```
  setUser(user);
}

loadUser();
```

}, []);

async function handleLogout() {
await supabase.auth.signOut();
window.location.href = "/";
}

return (
<div style={{ padding: "40px" }}> <h1>My Account</h1>

```
  <p>
    <strong>Email:</strong> {user?.email}
  </p>

  <button onClick={handleLogout}>
    Logout
  </button>
</div>
```

);
}
