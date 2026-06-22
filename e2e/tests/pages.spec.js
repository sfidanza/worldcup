import { test, expect } from '@playwright/test';

const PAGE_TITLE = (year) => {
  switch (year % 4) {
    case 0: return new RegExp(`UEFA Euro ${year}.*`);
    case 1: return new RegExp(`${year} FIFA Club World Cup.*`);
    case 2: return new RegExp(`${year} FIFA Worldcup.*`);
    default: return '';
  }
};

test('2022 history @sanity', async ({ page }) => {
  await page.goto('/2022');
  const history = await page.getByRole('link', { name: 'FIFA Worldcup' });
  await history.click();
  await expect(page).toHaveURL(/.*#history,worldcup/);
  await expect(page).toHaveScreenshot('history.png');
});

for (const rep of ['2026', '2025', '2018 @sanity', '2016', '2010']) {
  const year = rep.slice(0, 4);
  test(`${rep} pages`, async ({ page }) => {
    await page.goto(`/${year}`);
    await checkNavigation(page, year);
  });
}

async function checkNavigation(page, year) {
  // Schedule - default page
  await expect(page).toHaveTitle(PAGE_TITLE(year));
  await expect(page).toHaveScreenshot(`${year}-schedule.png`);

  // Other pages
  await checkPage(page, 'Group Rankings', /.*#group/, `${year}-groupA.png`);
  await checkPage(page, 'B', /.*#group,B/, `${year}-groupB.png`);
  await checkPage(page, 'Finals Board', /.*#board/, `${year}-board.png`);
}

async function checkPage(page, linkTitle, pageTitle, filename) {
  const link = page.getByRole('link', { name: linkTitle, exact: true });
  await link.click();
  await expect(page).toHaveURL(pageTitle);
  await expect(page).toHaveScreenshot(filename);
}