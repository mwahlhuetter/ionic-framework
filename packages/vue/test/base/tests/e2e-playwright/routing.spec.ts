import { test, expect, Page } from '@playwright/test';
import { options } from 'ionicons/icons';

async function ionPageVisible (page: Page, pageId: string) {
  const ionPage = await page.locator(`.ion-page[data-pageid=${pageId}]`)

  await ionPage.waitFor({ state: 'visible', timeout: 5000 })
  const isVisible = await ionPage.isVisible()
  expect(isVisible).toBe(true)
  
  const count = await ionPage.count()
  expect(count).toBe(1)

  await page.waitForSelector(`.ion-page[data-pageid=${pageId}]:not(.ion-page-hidden):not(.ion-page-invisible)`, { timeout: 5000 })

  const hiddenOrInvisible = await ionPage.evaluate((el) => {
    console.log(el.getAttribute('data-pageid'), JSON.stringify(el.classList))
    return ['ion-page-hidden', 'ion-page-invisible'].some(cls => el.classList.contains(cls))
  })
  expect(hiddenOrInvisible).toBe(false)
}

test('should navigate to page after browser refresh and navigate back', async ({ page }) => {
  await page.goto('http://localhost:8080/nested');
  await page.waitForURL('**/nested')
  await ionPageVisible(page, 'nestedchild')

  await page.click('#other')
  await page.waitForURL('**/nested/two')
  await ionPageVisible(page, 'nestedchildtwo')

  await page.reload()
  await page.waitForURL('**/nested/two')
  await ionPageVisible(page, 'nestedchildtwo')
  
  await page.goBack()
  await page.waitForURL('**/nested')
  await ionPageVisible(page, 'nestedchild')

  await page.click('#other')
  await page.waitForURL('**/nested/two')
  await ionPageVisible(page, 'nestedchildtwo')

});
