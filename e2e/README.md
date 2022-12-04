# Worldcup e2e tests

This playwright test suite can be run inside its container, targeting the production domain. Here are the steps to follow:

- Start the container: `docker compose up -d e2e`
- Shell into the container to run the full test campaign: `npm run test`
- Or alternatively only run the sanity subset: `npm run sanity`
- If the campaign has failures, the report will be started autmatically, otherwise, you can launch it through: `npm run report`
- Once it report mode, you can access it on <http://localhost:9323>

The campaign contains visual testing (comparison with reference screenshots). To update the reference screenshots:

    npm run test -- --update-snapshots

You can iterate on tests as much as needed and stop the container once finished: `docker compose down`

## Note

When the test campaign runs succesfully, it will indicate that the report can be run using `npx playwright show-report`. This would not work here as the host ip needs to be tweaked when running inside a container:

    npx playwright show-report --host=0.0.0.0

This is what the `package.json` alias `report` is doing so you can simply use: `npm run report`

## To do

- Increase campaign coverage (mouseover features, bets, admin?)
- Run the campaign on the label being built, rather than production
  - Can be driven by env variable, to reuse the same campaign (or a subset)
  - Currently possible in local dev by editing `playwright.config.js` (the 2 values of `baseURL` are defined: prod and local dev)

## References

- Playwright reference documentation:
  - <https://playwright.dev/>
  - <https://github.com/microsoft/playwright>
