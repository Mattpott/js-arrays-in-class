console.log(data);

// 1. instead of creating the cards manually, we should use array functions to convert the data into cards
const courseToCard = ({
  prefix,
  number,
  title,
  url,
  desc,
  prereqs,
  credits,
}) => {
  const prereqLinks = prereqs
    .map((prereq) => `<a href="#" class="card-link">${prereq}</a>`)
    .join();
  const courseTemplate = `<div class="col">
            <div class="card" style="width: 18rem;">
              <h3 class="card-header"><a href="${url}">${title}</a></h3>
              <div class="card-body">
                <h5 class="card-title">${prefix} ${number}</h5>
                <p class="card-text">${desc}</p>
                ${prereqLinks}
                <div id="credits" class="card-footer text-muted">
                  ${credits}
                </div>
              </div>
            </div>
          </div>`;
  return courseTemplate;
};
const resultsContainer = document.querySelector("#filtered-results");
const courseCards = data.items.map(courseToCard);
resultsContainer.innerHTML = courseCards.join("");

// 2. maybe we only show those that match the search query?
const filterCourseCard = (course, query) => {
  console.log(course, query);
  let include = course.prefix.toLowerCase().includes(query.toLowerCase())
    || course.title.toLowerCase().includes(query.toLowerCase())
    || course.url.toLowerCase().includes(query.toLowerCase())
    || course.desc.toLowerCase().includes(query.toLowerCase())
    || course.number == query || course.credits == query;
  if (!include) {
    let queriedPrereq = course.prereqs.find((prereq) => {
      return prereq == query;
    });
    include = queriedPrereq != undefined;
  }
  return include;
};

let filteredCourseCards = data.items;
updateResults();

const searchButton = document.getElementById("search-btn");
searchButton.addEventListener("click", (ev) => {
  console.log(ev);
  ev.preventDefault();
  // ev.stopPropagation();
  const searchField = document.querySelector('input[name="query-text"]');
  const queryText = searchField.value;
  console.log(queryText);
  filteredCourseCards = data.items.filter((course) =>
    filterCourseCard(course, queryText)
  );
  let filteredMarkup = filteredCourseCards.map(courseToCard);
  resultsContainer.innerHTML = filteredMarkup.join("");
  updateResults();
});

// 3. we update the result count and related summary info as we filter
function updateResults() {
  const creditHours = filteredCourseCards.reduce((p, n) => p.concat(n.credits), [0])
    .reduce((p, n) => p + n);
  const filteredPrereqsList = filteredCourseCards.map((c) => c.prereqs)
    .reduce((p, n) => p.concat(n), [0]);
  let prereqCreditHours = 0;
  data.items.filter((c) => filteredPrereqsList.includes(c.number))
    .forEach((c) => prereqCreditHours += c.credits);
  const summaryInfo = `<h2>Summary</h2>
  <dl>
    <dt>Count</dt>
    <dd><span>${filteredCourseCards.length}</span> item(s)</dd>
    <dt>Cost</dt>
    <dd><span>${creditHours}</span> credit-hours + <span>${prereqCreditHours}</span> credit-hours of prereqs</dd>
  </dl>`;
  const summaryContainer = document.querySelector('div#summary');
  summaryContainer.innerHTML = summaryInfo;
}