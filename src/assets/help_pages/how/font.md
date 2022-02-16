# Pixel-perfect fonts

Modern computers use almost excusively vector-based fonts, formats such as TrueType (TTF) and PostScript (OTF). Vector fonts are great: small file sizes, effectively infinite detail, and amazing flexibility. Text rendering has come a long way too, and fonts look better than ever.

When emulating the look of an oldschool PC, though, we don't \*want\* smooth, antialiased text. It'll just look wrong, because that's not what text looked like in computers back then. For best results, we want crisp, pixel-perfect text like you'd get from a bitmap font, but web browsers, like most modern software, lack support for such font formats.

## Retro fonts

Emulating a pixelated bitmap font in a vector format is easy enough: you just have to draw square lines on a grid. There's [great adaptations](https://int10h.org/oldschool-pc-fonts/) of old bitmap fonts to be found online. Getting the browser to render it just right is somewhat trickier.

## Font size

The first step in getting a web browser to render pixel-perfect text is to get the font size just right: we can use only multiples of the font's pixel height, such that each font pixel maps exactly to a number of **hardware pixels** (this last part is important; we'll get to why and what it means in a second). Otherwise, antialiasing will kick in and our text will look blurry (having no antialiasing at all would be even worse: the font would appear distorted, with some rows and columns of pixels larger than others).

### High-res displays and DPI scaling

Setting the font size just right is enough to get pixel-perfect (or close to it) text on standard, unscaled displays. These days though, that's not enough: many high resolution monitors and laptop displays use a non-integer scaling factor like 150%. On such a display, 16px becomes 24 \*real\* pixels, the size is no longer just right, and your font looks blurry. Woe is you.

There's no real fix for this, but we can work around it by "snapping" our text to multiples accounting for scaling. For example, to deal with 150% scaling, we could divide all our sizes by 1.5, causing our app to render as if scaling was set to 100% with the right font size. We could also multiply everything by (2/1.5)=4/3, for an "effective" scaling of 200%. The actual number doesn't matter, as long as it's an integer.

DitherOS deals with this by detecting display scaling, then scaling the \*entire app\* to the nearest integer. It does this by redefining the root font size, and having every UI element sized in font size relative **rem** and **em** units. It scales everything rather than just text for two reasons: to keep a consistent font-to-ui size ratio, and because most icons and UI elements are designed to be pizel-perfect as well.

## TTF vs Web Fonts

Even doing everything right, it's still nearly impossible to achieve pixel-perfect text in a real web application. There are many reasons, chief among them that the \*position\* of your text can be a non-integer number and there's nothing you can do about that.

There's a solution for this, however. Turns out, browsers \*do\* support bitmap fonts! Well, sort of, anyway. It's complicated. 

The short version: TTF fonts can contain bitmap font data alongside the vector data, to render pixel-perfect fonts when the size is just right (all [fonts used in this app](https://int10h.org/oldschool-pc-fonts/) have a version with it). This rendering is flawless, and browsers \*do\* support it. The Web Font spec, however, doesn't; should you try to load such a TTF for use with CSS, the sanitizer will reject it. No font for you. This means you can have pixel-perfect, bitmap enabled TTF fonts, as long as the user manually installed them in their computer. Not very convenient.

DitherOS is set to use the Web Font version of all fonts, but does look for installed TTF versions of most fonts first (excluding a few with incompatible sizes). Thus, for the best pixel-perfect results, you might want to download and install the fonts used in their **Mx (mixed outline)** TTF version (and really, you should just download them anyway because they're cool).
