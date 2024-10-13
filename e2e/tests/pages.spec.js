import { test, expect } from '@playwright/test';

// test.beforeEach(async ({ page }) => {
//   await page.goto('/');
// });

test('history @sanity', async ({ page }) => {
  await page.goto('/');
  const history = page.getByRole('link', { name: 'FIFA Worldcup' });
  await history.click();
  await expect(page).toHaveURL(/.*#history,worldcup/);
  await expect(page).toHaveScreenshot('history.png');
});

for (const rep of ['2022', '2018 @sanity', '2014', '2010']) {
  const year = rep.slice(0, 4);
  test(`${rep} pages`, async ({ page }, workerInfo) => {
    await page.goto(`/${year}`);
    await checkNavigation(page, year, workerInfo);
  });
}

async function checkNavigation(page, year, workerInfo) {
  // Schedule - default page
  await expect(page).toHaveTitle(new RegExp(`${year} FIFA Worldcup.*`));
  await expect(page).toHaveScreenshot(`${year}-schedule.png`);

  // Other pages
  if (!/Mobile/.test(workerInfo.project.name)) {
    await checkPage(page, 'Group Rankings', /.*#ranking/, `${year}-ranking.png`); // not present in small screens
  }
  await checkPage(page, 'Finals Board', /.*#board/, `${year}-board.png`);
  await checkPage(page, 'A', /.*#group,A/, `${year}-groupA.png`);
}

async function checkPage(page, linkTitle, pageTitle, filename) {
  const link = page.getByRole('link', { name: linkTitle, exact: true });
  await link.click();
  await expect(page).toHaveURL(pageTitle);
  await expect(page).toHaveScreenshot(filename);
}