import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSocialAccounts } from "@/lib/db/social-accounts";

// GET /api/social-accounts - Get all social accounts for authenticated user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accounts = await getSocialAccounts(user.id);
    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Error fetching social accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch social accounts" },
      { status: 500 }
    );
  }
}
