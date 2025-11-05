# Dr Pepper Ipsum Generator

Dr Pepper Ipsum Generator is a small website that creates Dr Pepper themed placeholder text. It is for designers, developers, and writers who need filler copy for mockups, layouts, and drafts and want something more fun than plain lorem ipsum. You pick how many paragraphs you want, press one button, and the text appears on the page.

## Generating Text

- Creates placeholder text that mixes Dr Pepper words, such as flavors, soda terms, and hometown names, with classic lorem ipsum words.
- Lets you choose how many paragraphs to create, from 1 up to 100.
- Starts with 4 paragraphs selected so you can generate text right away.
- Falls back to 4 paragraphs when the number entered is missing or outside the allowed range.
- Opens every result with the sentence "Dr Pepper lorem ipsum."
- Builds each paragraph from 3 to 7 sentences of 5 to 12 words, so every result reads differently.
- Uses Dr Pepper words far more often than lorem ipsum words, so the text keeps its soda flavor.
- Capitalizes the start of each sentence and ends it with a period, so the text looks like real copy.

## Page and Interface

- Shows the new text in a box on the same page without reloading.
- Displays a short prompt in the text box before you generate anything for the first time.
- Changes the button to "Generating..." and disables it while text is being created, which prevents double clicks.
- Shows a friendly error message in the text box if the text could not be created.
- Uses a Dr Pepper inspired maroon and cream color scheme.
- Fits the screen on phones, tablets, and computers.
- Opens the generator page from any address on the site, so mistyped links still land somewhere useful.

## Use From Other Apps

- Lets other programs request generated text directly from the site's api address by sending a paragraph count.
- Accepts the paragraph count as a form upload, a regular form post, or JSON, and uses 4 paragraphs if none is sent.
- Returns the text as ready to use web page paragraphs that can be dropped straight into a page.
- Returns a plain list of paragraphs instead when the request asks for JSON.
- Replies with a plain error message if something goes wrong while creating the text.
- Limits each visitor to 60 api requests per minute and replies "too many requests" beyond that.
- Answers unknown api addresses with a "not found" reply instead of the web page.

```sh
curl -X POST -d paragraphs=2 https://drpepperipsum.com/api
```
