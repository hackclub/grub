import { NextResponse } from "next/server";
import { submissionsTable } from "@/lib/airtable";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const status = searchParams.get("status") || "Approved";
  if (!["Approved", "Pending", "Rejected", "Needs Changes"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const meal = searchParams.get("meal") || "Any";
  if (
    ![
      "Any",
      "Basic Meal ($6)",
      "Refreshment Combo ($8)",
      "Full Combo Meal ($10)",
    ].includes(meal)
  ) {
    return NextResponse.json({ error: "Invalid meal choice" }, { status: 400 });
  }

  let filterByFormula = `{Status} = "${status}"`;
  if (meal !== "Any") {
    filterByFormula = `AND({Status} = "${status}", {Meal Choice} = "${meal}")`;
  }

  console.log(filterByFormula);

  const query = await submissionsTable
    .select({
      fields: [
        "Code URL",
        "Screenshot",
        "Status",
        "Playable URL",
        "Meal Choice",
      ],
      filterByFormula: filterByFormula,
    })
    .all();
  console.log(query);
  const submissions = query.map((record) => {
    const screenshots = record.get("Screenshot");
    const screenshotUrl =
      screenshots && Array.isArray(screenshots) && screenshots.length > 0
        ? screenshots[0].url
        : "";

    const date = record._rawJson.createdTime;

    return {
      id: record.id,
      codeUrl: record.get("Code URL"),
      screenshot: screenshotUrl,
      status: record.get("Status"),
      demo: record.get("Playable URL"),
      mealChoice: record.get("Meal Choice"),
      date: date,
    };
  });

  return NextResponse.json({ submissions });
}
