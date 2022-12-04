import { test, expect } from '@playwright/test';

// test.beforeEach(async ({ page }) => {
//   await page.goto('/');
// });

test('history @sanity', async ({ page }) => {
  await page.goto('/');
  const history = page.getByRole('link', { name: 'History' });
  await history.click();
  await expect(page).toHaveURL(/.*#history/);
  await expect(page).toHaveScreenshot('history.png');
});

test('2022 pages', async ({ page }) => {
  await page.goto('/');
  await checkNavigation(page, '2022');
});

test('2018 pages @sanity', async ({ page }) => {
  await page.goto('/2018');
  await checkNavigation(page, '2018');
});

test('2014 pages', async ({ page }) => {
  await page.goto('/2014');
  await checkNavigation(page, '2014');
});

test('2010 pages', async ({ page }) => {
  await page.goto('/2010');
  await checkNavigation(page, '2010');
});

async function checkNavigation(page, year) {
  // Schedule - default page
  await expect(page).toHaveTitle(new RegExp(`${year} Worldcup.*`));
  await expect(page).toHaveScreenshot(`${year}-schedule.png`);

  // Other pages
  // await checkPage(page, 'Group Rankings', /.*#ranking/, `${year}-ranking.png`); // not present in small screens
  await checkPage(page, 'Finals Board', /.*#board/, `${year}-board.png`);
  await checkPage(page, 'A', /.*#group,A/, `${year}-groupA.png`);
  await checkPage(page, 'D', /.*#group,D/, `${year}-groupD.png`);
  await checkPage(page, 'G', /.*#group,G/, `${year}-groupG.png`);
}

async function checkPage(page, linkTitle, pageTitle, filename) {
  const link = page.getByRole('link', { name: linkTitle, exact: true });
  await link.click();
  await expect(page).toHaveURL(pageTitle);
  await expect(page).toHaveScreenshot(filename);
}