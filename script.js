const BASE_DOMAIN = "junk.artem-kim.hackclub.app";

let submissionStatus = "Approved";
let mealChoice = "Any";
fetchData();

document.getElementById("status").addEventListener("change", () => {
  submissionStatus = document.getElementById("status").value;
  console.log(submissionStatus);
  fetchData();
});

document.getElementById("meal").addEventListener("change", () => {
  mealChoice = document.getElementById("meal").value;
  console.log(mealChoice);
  fetchData();
});

function getLabel() {
  if (submissionStatus === "Approved") {
    return '<span class="px-2 py-1 text-sm bg-green-500 rounded-xl">Approved</span>';
  } else if (submissionStatus === "Pending") {
    return '<span class="px-2 py-1 text-sm bg-yellow-500 rounded-xl">Pending</span>';
  } else if (submissionStatus === "Rejected") {
    return '<span class="px-2 py-1 text-sm bg-red-500 rounded-xl">Rejected</span>';
  } else if (submissionStatus === "Needs Changes") {
    return '<span class="px-2 py-1 text-sm bg-orange-500 rounded-xl">Needs Changes</span>';
  }
}

async function fetchData() {
  const params = new URLSearchParams();
  params.append("status", submissionStatus);
  params.append("meal", mealChoice);
  const response = await fetch(
    `https://${BASE_DOMAIN}/api/submissions?${params}`
  );
  const submissions = await response.json();

  console.log(submissions);

  let submissionsPush = "";
  submissions.submissions.forEach((submission) => {
    const date = new Date(submission.date);
    submissionsPush += `<div class="py-6 px-8 bg-red-700 rounded-xl shadow-lg">
          <a href="${submission.demo}" target="_blank"
            class="block cursor-pointer mb-4 h-48 rounded-xl bg-cover bg-center shadow-xl bg-[url(${
              submission.screenshot
            })]">
          </a>
          ${getLabel()}
          <p class="text-mg text-white mt-2">
            ${submission.mealChoice}
          </p>
          <div class="flex gap-x-2 mt-2 mb-4">
            <a href="${submission.demo}" target="_blank"
              class="text-md flex gap-x-2 items-center text-red-900 text-center rounded-xl bg-yellow-300 hover:bg-yellow-400 px-4 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" class="fill-red-900">
                <path
                  d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
              </svg>
              Demo
            </a>
            <a href="${submission.codeUrl}" target="_blank"
              class="text-md flex gap-x-2 items-center text-white text-center rounded-xl bg-black hover:bg-gray-800 px-4 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px"
                fill="#fff">
                <path
                  d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z" />
              </svg>
              Github
            </a>
          </div>

          <p class="text-sm border-t border-yellow-300 pt-4">Submitted on ${date.toLocaleDateString(
            "en-US"
          )}</p>
        </div>`;
  });

  if (submissionsPush === "") {
    document.getElementById("submissions").innerHTML =
      "<h1 class='text-2xl text-white'>No submissions found</h1>";
  } else {
    document.getElementById("submissions").innerHTML = submissionsPush;
  }
}
