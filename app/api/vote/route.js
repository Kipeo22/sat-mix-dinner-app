import { NextResponse } from "next/server";
import { addVote } from "../../../lib/spreadsheet"; // パスを修正

export async function POST(request) {
  try {
    const voteData = await request.json();
    await addVote(voteData);
    return NextResponse.json({ message: "Vote added successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add vote" }, { status: 500 });
  }
}
