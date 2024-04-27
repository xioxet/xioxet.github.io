from PIL import Image, ImageSequence

def dither_gif(input_path, output_path):
    # Open the GIF image
    gif = Image.open(input_path)

    # Create a list to hold each frame after processing
    frames = []

    # Loop through each frame in the GIF
    for frame in ImageSequence.Iterator(gif):
        # Convert the frame to grayscale
        grayscale_frame = frame.convert('L')

        # Apply dithering
        dithered_frame = grayscale_frame.convert('1', dither=Image.FLOYDSTEINBERG)

        # Append the processed frame to the list
        frames.append(dithered_frame)

    # Save each frame as a separate image
    for i, frame in enumerate(frames):
        frame.save(f"{output_path}_frame_{i}.png")

# Example usage
input_path = 'media/blackwaves.gif'
output_path = 'x.gif'
dither_gif(input_path, output_path)
