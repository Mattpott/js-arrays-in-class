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
                <div class="card-footer text-muted">
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
// courseCards.forEach((c) => document.write(c));

// console.log(courseCards);
// document.write(courseCards.join(''))

// 2. maybe we only show those that match the search query?
//

const filterCourseCard = (markup, query) => {
  console.log(markup, query);
  return markup.toLowerCase().includes(query.toLowerCase());
};

let filteredCourseCards = courseCards;

const searchButton = document.getElementById("search-btn");
searchButton.addEventListener("click", (ev) => {
  console.log(ev);
  ev.preventDefault();
  // ev.stopPropagation();
  console.log("query text");
  const searchField = document.querySelector('input[name="query-text"]');
  const queryText = searchField.value;
  console.log(queryText);
  filteredCourseCards = courseCards.filter((card) =>
    filterCourseCard(card, queryText)
  );
  console.log('filteredCourseCards', filteredCourseCards);
  resultsContainer.innerHTML = filteredCourseCards.join("");
  updateResults();
});

// 3. we update the result count and related summary info as we filter
function updateResults() {
  const creditHours = filteredCourseCards.reduce((p, n) => 
  {p.credits + n.credits;}, filteredCourseCards[0]);
  const prereqCreditHours = filteredCourseCards.map((p) => { p.prereqs; }).reduce((p, n) => 
  {p.credits + n.credits;}, filteredCourseCards[0]);
  const summaryInfo = `<h2>Summary</h2>
  <dl>
    <dt>Count</dt>
    <dd><span>${filteredCourseCards.length}</span> items</dd>
    <dt>Cost</dt>
    <dd><span>${creditHours}</span> credit-hours + <span>${prereqCreditHours}</span> credit-hours of prereqs</dd>
  </dl>`;
  console.log(summaryInfo);
  const summaryContainer = document.querySelector('div#summary');
  summaryContainer.innerHTML = summaryInfo;
}