import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteSocialAccount } from "@/lib/db/social-accounts";

// DELETE /api/social-accounts/[id] - Delete a social account
export async function DELETE(request: NextRequest, { params }: any) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accountId = id;

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID is required" },
        { status: 400 }
      );
    }

    await deleteSocialAccount(accountId, user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting social account:", error);
    return NextResponse.json(
      { error: "Failed to delete social account" },
      { status: 500 }
    );
  }
}
