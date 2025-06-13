import { getCategories } from "@/lib/sanity";
import { NextResponse } from "next/server";

export const revalidate = 60;

export const GET = async () => {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
} 