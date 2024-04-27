from PIL import Image, ImageSequence

def crop_1px_border(input_path, output_path):
    # Open the GIF image
    gif = Image.open(input_path)

    # Initialize a list to hold each frame of the cropped GIF
    cropped_frames = []

    # Loop over each frame in the GIF
    for frame in ImageSequence.Iterator(gif):
        # Get the size of the frame
        width, height = frame.size
        
        # Crop 1px border from each side
        cropped_frame = frame.crop((1, 1, width - 1, height - 1))

        # Append the cropped frame to the list
        cropped_frames.append(cropped_frame)

    # Save the list of cropped frames as a GIF
    cropped_frames[0].save(
        output_path,
        save_all=True,
        append_images=cropped_frames[1:],
        duration=gif.info["duration"],
        loop=0,
    )

# Example usage
input_path = "perlin_noise.gif"
output_path = "meep `.gif"
crop_1px_border(input_path, output_path)
