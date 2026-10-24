# Asset provenance

Two illustrative desert BBQ photographs requested by the user were generated during this revision and recovered from the earlier generation outputs:

- `frontend/public/images/safaris/bbq-dinner-spread.webp`: grilled barbecue dishes, salads and flatbread in a lantern-lit Dubai desert camp.
- `frontend/public/images/safaris/bbq-camp-grill.webp`: a chef preparing grilled food at a desert camp at blue hour.

These are illustrative AI-generated scenes, not documentary photographs of a particular client's event. Their image alt text identifies them as illustrative. They are included only in the BBQ tour gallery.

The transparent gold skyline logo is the recovered logo edit from this task, exported as `frontend/public/images/brand/zuhd-tours-logo-clear.webp`. Its transparency is preserved and no CSS circle, border or background is applied.

The four additional morning, adventure and overnight images came from the user's October 20 uploads. All tour mappings are now centralized in `src/data/referenceMedia.js` and descriptions in `src/data/galleryAltText.js`.

## October 23 city photos

Seven supplied PNGs were optimized to WebP (113–291 KiB each), retaining their aspect ratio. Static photos live in the frontend, so they do not occupy MongoDB storage.

| Upload | Website image | Page |
| --- | --- | --- |
| image(20261023-122039).png | dubai-burj-khalifa.webp | Dubai |
| image(20261023-122056).png | dubai-burj-al-arab.webp | Dubai |
| image(20261023-122112).png | dubai-frame.webp | Dubai |
| image(20261023-122121).png | dubai-palm-jumeirah.webp | Dubai hero + gallery |
| image(20261023-122136).png | abu-dhabi-emirates-palace.webp | Abu Dhabi |
| image(20261023-122145).png | abu-dhabi-grand-mosque.webp | Abu Dhabi hero + gallery |
| image(20261023-122150).png | abu-dhabi-louvre.webp | Abu Dhabi |

Dubai uses the four supplied Dubai photos. Abu Dhabi uses its three supplied photos, without keeping an unrelated old stock image to fill a fourth slot. The family safari gallery includes the existing desert-view and camp photos plus the supplied sandboarding and camp-dinner images, for four in total.
